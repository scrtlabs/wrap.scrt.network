import { StyledButton } from './styled';

export const Button = ({title = ''}) => {
  return (
    <StyledButton>
      <p>{title}</p>
    </StyledButton>
  )
}