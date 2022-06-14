import { StyledButton } from './styled';
import { Loader } from '../Content/Loader/Loader';

interface ButtonProps {
  title: string,
  action: () => void,
  isLoading?: boolean,
  errorClass?: string,
}

export const Button = ({title = '', action = () => {}, isLoading = false, errorClass = ''}: ButtonProps) => {
  return (
    <StyledButton onClick={action} isLoading={isLoading} className={errorClass}>
      {isLoading ? <Loader/> : <p>{title}</p>}
    </StyledButton>
  )
}