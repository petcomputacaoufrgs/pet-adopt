import axios from 'axios';
import { isPublicApiEndpoint } from '../constants/routes';

// Configuração base da API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3002/api/v1',
  withCredentials: true, // Permite o envio de cookies com as requisições
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fila para requisições pendentes após refresh token
let failedQueue: Array<{
  resolve: (value?: boolean) => void;
  reject: (reason?: unknown) => void;
}> = [];

// Função para processar a fila de requisições que falharam
const processQueue = (error: unknown, success = false) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(success);
    }
  });
  
  failedQueue = [];
};

// Interceptor para respostas (tratamento global de erros e refresh token)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const statusCode = error.response?.status;
    const errorMessage = error.response?.data?.message || 'Erro interno do servidor';

    // Tratamento unificado de erro 401 (Unauthorized)
    if (statusCode === 401) {
      const isPublic = isPublicApiEndpoint(originalRequest.url);

      // Se já tentou refresh ou é rota pública - apenas rejeitar
      if (originalRequest._retry || isPublic) {
        return Promise.reject(error);
      }

      // É rota privada e não tentou refresh ainda
      originalRequest._retry = true;

      try {
        // Tentar fazer refresh do token
        const refreshResponse = await api.post('/auth/refresh');
        
        // Aceitar tanto 200 (OK) quanto 201 (Created)
        if (refreshResponse.status === 200 || refreshResponse.status === 201) {
          // Processar fila de requisições pendentes
          processQueue(null, true);
          
          // Tentar novamente a requisição original
          const retryResponse = await api(originalRequest);
          
          return retryResponse;
        }
        
        throw new Error(`Refresh falhou com status ${refreshResponse.status}`);
      } catch (refreshError: unknown) {
        // Processar fila com erro
        processQueue(refreshError, false);
        
        // Limpar dados de autenticação do localStorage (se houver)
        localStorage.removeItem('user');
        
        // Redirecionar para login se não estiver já lá
        if (window.location.pathname !== '/login') {
          localStorage.setItem('authError', 'Sua sessão expirou. Faça login novamente.');
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        // Resetar flag após finalizar refresh (mantido para compatibilidade)
      }
    }

    // Outros tratamentos de erro
    switch (statusCode) {
      case 403:
        if (window.location.pathname !== '/') {
          localStorage.setItem('authorizationError', 'A sua conta não tem autorização para acessar esta funcionalidade.');
          if (!isPublicApiEndpoint(originalRequest.url)){
            window.location.href = '/';
          }
        }
        break;

      case 404:
        console.error('Recurso não encontrado:', errorMessage);
        break;

      case 500:
        console.error('Erro interno do servidor:', errorMessage);
        break;

      default:
        console.error('Erro na requisição:', errorMessage);
    }

    return Promise.reject(error);
  }
);

export default api;
