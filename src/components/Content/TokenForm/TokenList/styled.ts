import styled from "styled-components";

export const StyledTokenList = styled.ul`
  list-style-type: none;
  display: flex;
  justify-content: center;
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
    margin-right: 12px;
    position: relative;
    width: 40px;
    cursor: pointer;
    &:before {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      background: grey;
      z-index: 1000;
    }
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
    &:hover .soon {
      visibility: visible;
    }

    & img {
      border-radius: 50%;
      width: 32px;
      height: 32px;
      transition: 0.1s;
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

    & .soon {
      position: absolute;
      visibility: hidden;
      white-space: nowrap;
      top: 30px;
      margin-top: 16px;
      font-size: 12px;
      line-height: 24px;
      font-family: ${({ theme }) => theme.fonts.hind_regular};
      @media (max-width: 576px) {
        font-size: 13px;
        margin-top: 6px;
      }
    }
  }
  & .coming-soon {
    cursor: not-allowed;

    & img {
      filter: brightness(0.5);
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
`;
