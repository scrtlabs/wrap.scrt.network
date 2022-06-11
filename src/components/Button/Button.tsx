import { StyledButton } from './styled';
import { Loader } from '../Content/Loader/Loader';

interface ButtonProps {
  title: string,
  action: () => void,
  isLoading?: boolean,
}

export const Button = ({title = '', action = () => {}, isLoading = false}: ButtonProps) => {
  return (
    <StyledButton onClick={action} isLoading={isLoading}>
      {isLoading ? <Loader/> : <p>{title}</p>}
    </StyledButton>
  )
}