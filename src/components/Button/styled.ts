import styled from 'styled-components';

export const StyledButton = styled.button`
  max-width: 220px;
  width: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 11px;
  text-transform: uppercase;
  background: ${({ theme }) => theme.colors.orange};
  font-family: ${({ theme }) => theme.fonts.monsterRat_semiBold};
  font-size: 16px;
  line-height: 24px;
  border-radius: 10px;
  margin: 24px auto 0 auto;
  cursor: pointer;
  opacity: .9;
  @media (max-width: 576px) {
    width: 100%;
    max-width: 100%;
    margin: 12px auto 0 auto;
  }
  
  &:hover {
    opacity: 1;
  }
`