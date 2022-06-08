import styled from 'styled-components';

export const StyledKeplr = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 8px;
  cursor: pointer;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.active_bg};
  font-family: ${({ theme }) => theme.fonts.monsterRat_semiBold};

  & img {
    width: 24px;
    height: 24px;
    margin-right: 7px;
  }

  & .keplr-title {
    text-transform: uppercase;
  }
`