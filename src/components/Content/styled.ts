import styled from 'styled-components';

export const StyledContent = styled.div`
  position: absolute;
  width: 100%;

  & .content-wrap {
    display: flex;
    justify-content: center;
    @media (max-width: 992px) {
      flex-direction: column-reverse;
      align-items: center;
    }
  }
`
