import styled from 'styled-components';

export const StyledTokenList = styled.ul`
  list-style-type: none;
  display: flex;
  margin-top: auto;
  margin-bottom: 50px;
  @media (max-width: 576px) {
    margin-bottom: 70px;
  }

  & .token-wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    cursor: pointer;
    margin-right: 12px;
    position: relative;
    width: 40px;

    &:hover img {
      width: 48px;
      height: 48px;
      @media (max-width: 576px) {
        width: 32px;
        height: 32px;
      }
    }

    &:hover .name {
      visibility: visible;
    }

    & img {
      width: 32px;
      height: 32px;
      transition: .1s;
      position: absolute;
      @media (max-width: 576px) {
        width: 24px;
        height: 24px;
      }
    }

    & .name {
      position: absolute;
      visibility: hidden;
      top: 15px;
      margin-top: 16px;
      font-size: 16px;
      line-height: 24px;
      font-family: ${({ theme }) => theme.fonts.hind_regular};
      @media (max-width: 576px) {
        font-size: 13px;
        margin-top: 6px;
      }
    }
  }

  & .token-wrap.active img {
    width: 48px;
    height: 48px;
    @media (max-width: 576px) {
      width: 32px;
      height: 32px;
    }
  }

  & .token-wrap.active span {
    visibility: visible;
  }
`