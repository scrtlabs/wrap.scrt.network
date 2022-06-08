import styled from 'styled-components';

export const StyledPercentOptions = styled.div`
  margin: 24px 0;
  display: flex;
  justify-content: center;
  @media (max-width: 576px) {
    margin: 20px 0;
  }
  & span {
    font-family: ${({ theme }) => theme.fonts.hind_regular};
    font-size: 14px;
    line-height: 24px;
    margin: 0 6px;
    cursor: pointer;
    transition: .3s;
  }

  & span.active {
    color: ${({ theme }) => theme.colors.orange};
  }
`