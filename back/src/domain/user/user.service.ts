import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { FilterQuery, Model } from 'mongoose';
import { UserData } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Role } from 'src/core/enums/role.enum';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { TokenService } from 'src/modules/auth/services/token.service';
import { UserQueryDto } from './dtos/user-query.dto';
import { MAX_PAGE_SIZE } from 'src/core/dtos/pagination-query.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(forwardRef(() => TokenService)) private tokenService: TokenService,
  ) {}

  async getAll(filters: UserQueryDto = new UserQueryDto()) {
    const { page: _page, limit: _limit, ...searchFilters } = filters;
    // Remove filtros vazios
    Object.keys(searchFilters).forEach((key) => {
      if (!searchFilters[key]) delete searchFilters[key];
      if (typeof searchFilters[key] === 'string')
        searchFilters[key] = searchFilters[key]
          .replace(/^"+|"+$/g, '')
          .replace(/^'+|'+$/g, '');
    });

    if (searchFilters.role) searchFilters.role = searchFilters.role;

    const users = await this.userModel.find(searchFilters); // .populate('NGO');Popula o campo NGO se existir

    return users;
  }

  async getPage(ngoId: string, filters: UserQueryDto = new UserQueryDto(), approved = true) {
    // 1. Extrair paginação e separar dos filtros de busca
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, Number(filters.limit) || 12),
    );

    // Removemos page/limit do objeto filters para não quebrar a query do Mongoose
    const searchFilters = { ...filters };
    delete searchFilters.page;
    delete searchFilters.limit;

    const query: FilterQuery<User> = {
      ngoId,
      role: approved ? Role.NGO_MEMBER : Role.NGO_MEMBER_PENDING,
    };

    if (searchFilters.name) {
      query.name = { $regex: new RegExp(searchFilters.name, 'i') };
    }

    // 2. Calcular o "Pulo" (Skip)
    const skip = (page - 1) * limit;

    // 3. Executar as duas queries em paralelo (Dados + Contagem Total)
    const [data, total] = await Promise.all([
      this.userModel.find(query).skip(skip).limit(limit).exec(),
      this.userModel.countDocuments(query).exec(),
    ]);

    // 4. Retornar estrutura paginada
    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        limit,
      },
    };
  }

  async create(createUserDto: UserData, session?: any) {
    // Apenas contas pendentes dependem de uma ONG para aprovação.
    const ngoRolesRequiringAssociation = [
      Role.NGO_MEMBER_PENDING,
      Role.NGO_ADMIN_PENDING,
    ];
    if (
      ngoRolesRequiringAssociation.includes(createUserDto.role) &&
      !createUserDto.ngoId
    ) {
      throw new Error('ngoId é obrigatório para usuários de ONG');
    }

    // Membros independentes podem existir sem vínculo com uma ONG.
    const validRoles = [
      Role.ADMIN,
      Role.NGO_MEMBER,
      Role.NGO_MEMBER_PENDING,
      Role.NGO_ADMIN_PENDING,
    ];
    if (!validRoles.includes(createUserDto.role)) {
      throw new Error('Role inválida para criação de usuário');
    }

    const userCreated = new this.userModel(createUserDto);

    if (session) {
      return await userCreated.save({ session });
    } else {
      return await userCreated.save();
    }
  }

  async getById(id: string, userNgoId?: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar ownership se userNgoId foi fornecido (via guard)
    if (userNgoId && user.ngoId !== userNgoId) {
      throw new ForbiddenException(
        'Você não tem permissão para visualizar este usuário',
      );
    }

    return user;
  }

  async getByName(name: string): Promise<User | undefined> {
    return await this.userModel.findOne({ name });
  }

  async getByEmail(email: string): Promise<User | undefined> {
    return await this.userModel.findOne({ email }).select('+password');
  }

  async getByRole(role: Role): Promise<User[]> {
    return await this.userModel.find({ role });
  }
  async delete(id: string, userNgoId?: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar ownership se userNgoId foi fornecido (via guard)
    if (userNgoId && user.ngoId !== userNgoId) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar este usuário',
      );
    }

    // Revoga todos os tokens do usuário antes de deletar
    try {
      await this.tokenService.revokeAllUserTokens(id);
    } catch (error) {
      console.warn(`Falha ao revogar tokens do usuário ${id}:`, error.message);
      // Continua com a deleção mesmo se a revogação falhar
    }

    await this.userModel.findByIdAndDelete(id);
    return { message: 'Usuário deletado com sucesso', user };
  }

  async getUnapprovedMembers(
    ngoId: string,
    filters: UserQueryDto = new UserQueryDto(),
  ): Promise<User[]> {
    const query: FilterQuery<User> = { ngoId, role: Role.NGO_MEMBER_PENDING };
    if (filters.name) {
      query.name = { $regex: new RegExp(filters.name, 'i') };
    }
    return await this.userModel.find(query);
  }

  async getApprovedMembers(
    ngoId: string,
    filters: UserQueryDto = new UserQueryDto(),
  ): Promise<User[]> {
    const query: FilterQuery<User> = { ngoId, role: Role.NGO_MEMBER };

    if (filters.name) {
      query.name = { $regex: new RegExp(filters.name, 'i') };
    }

    return await this.userModel.find(query);
  }

  async deleteByNgoId(ngoId: string, session: any) {
    // Busca todos os usuários da ONG antes de deletar para revogar seus tokens
    const usersToDelete = await this.userModel.find({ ngoId }).session(session);

    // Revoga tokens de cada usuário
    for (const user of usersToDelete) {
      try {
        await this.tokenService.revokeAllUserTokens(user._id.toString());
      } catch (error) {
        console.warn(
          `Falha ao revogar tokens do usuário ${user._id}:`,
          error.message,
        );
        // Continua com os próximos usuários mesmo se a revogação falhar
      }
    }

    // Usa deleteMany para remover TODOS os usuários da ONG (admin + membros)
    const result = await this.userModel.deleteMany({ ngoId }, { session });

    // Registra quantos usuários foram deletados
    if (result.deletedCount === 0) {
      console.warn(`No users found with ngoId: ${ngoId}`);
    } else {
      console.log(
        `Deleted ${result.deletedCount} user(s) from ngoId: ${ngoId}`,
      );
    }

    return result;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    userNgoId?: string,
    session?: any,
  ) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar ownership se userNgoId foi fornecido (via guard)
    if (userNgoId && user.ngoId !== userNgoId) {
      throw new ForbiddenException(
        'Você não tem permissão para editar este usuário',
      );
    }

    const updateData = {
      ...(updateUserDto.name !== undefined && { name: updateUserDto.name }),
      ...(updateUserDto.email !== undefined && { email: updateUserDto.email }),
    };
    const userUpdated = await this.userModel.findByIdAndUpdate(id, updateData, {
      new: true,
      session,
      runValidators: true,
    });
    return userUpdated;
  }

  async updateUserRoleByNgoId(
    ngoId: string,
    newRole: string,
    session: any,
  ): Promise<User> {
    const user = await this.userModel
      .findOneAndUpdate(
        { ngoId: ngoId },
        { role: newRole },
        { new: true, session },
      )
      .exec();
    if (!user) {
      throw new NotFoundException('User for this NGO not found.');
    }
    return user;
  }

  async approve(id: string, userNgoId?: string): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar ownership se userNgoId foi fornecido (via guard)
    if (userNgoId && user.ngoId !== userNgoId) {
      throw new ForbiddenException(
        'Você não tem permissão para aprovar este usuário',
      );
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { role: Role.NGO_MEMBER },
      { new: true },
    );
    return updatedUser;
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true },
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }
}
