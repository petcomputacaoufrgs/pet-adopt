export interface IButton {
    width?: string;
    height?: string;
    buttonType?: string;
    isDisabled?: boolean;
    highlighted?: boolean;
    content: React.ReactNode;
    onClick?: any;
    type?: 'button' | 'submit' | 'reset';
    $flex?: boolean;
    paddingV?: string; 
    paddingH?: string;
    fontSize?: string;
}
