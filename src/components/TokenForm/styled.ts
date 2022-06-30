import styled from "styled-components";

export const StyledTokenForm = styled.div`
  width: 100%;
  max-width: 512px;
  height: 568px;
  border-radius: 10px;
  padding: 32px;
  background: ${({ theme }) => theme.colors.main_bg};
  display: flex;
  flex-direction: column;
  @media (max-width: 576px) {
    padding: 15px;
  }
  & .swiper-button-prev {
    top: 6px;
    left: 0;
    width: auto;
    height: auto;
    margin: 0;
    :after {
      font-size: 20px;
      line-height: 20px;
    }
  }
  & .swiper-button-next {
    right: 0;
    width: auto;
    height: auto;
    margin: 0;
    top: 6px;
    order: 2;

    :after {
      font-size: 20px;
      line-height: 20px;
    }
  }
  & .swiper {
    & .swiper-pagination {
      & .swiper-pagination-bullet {
        opacity: 1;
        background: ${({ theme }) => theme.colors.active_bg};
      }
      & .swiper-pagination-bullet-active {
        opacity: 1;
        background: ${({ theme }) => theme.colors.orange};
      }
    }
    & .swiper-wrapper {
      & .swiper-slide {
        justify-content: center;
        align-items: flex-start;
        display: flex;
      }
    }
  }
  & .wrapped-elems {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & .swap {
      margin: 0 12px;
      cursor: pointer;
    }
  }

  & .count {
    height: 44px;
    width: 220px;
    padding: 9px 0;
    margin-top: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${({ theme }) => theme.colors.bg};
    font-family: ${({ theme }) => theme.fonts.hind_regular};
    font-size: 16px;
    line-height: 26px;
    border-radius: 10px;
    margin: 24px auto 0px auto;
    @media (max-width: 576px) {
      width: 100%;
    }

    & input {
      background: ${({ theme }) => theme.colors.bg};
      color: ${({ theme }) => theme.colors.grey};
      border: none;
      text-align: center;
      &:focus,
      &:hover {
        outline: none;
      }
    }
  }

  & .deposit-withdraw-tabs {
    & .tab-list {
      background: none;

      & .tab-list-item {
        width: auto;
        font-size: 16px;
        line-height: 24px;
        font-family: ${({ theme }) => theme.fonts.monsterRat_Bold};
        margin-right: 34px;
      }

      & .tab-list-active {
        background: none;
      }

      & .tab-list-active span {
        color: ${({ theme }) => theme.colors.orange};
      }
    }

    & .deposit-block {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      white-space: nowrap;
      flex-wrap: wrap;
      font-family: ${({ theme }) => theme.fonts.hind_regular};
      & p {
        color: ${({ theme }) => theme.colors.grey};
      }
      & .one {
        color: ${({ theme }) => theme.colors.grey};
        margin: 0 4px;
      }
      & .items-block {
        background: ${({ theme }) => theme.colors.bg};
        border-radius: 10px;
        & .active-item {
          width: 100%;
          & .arrow-icon {
            margin-left: auto;
            flex-shrink: 0;
          }
        }
      }
      & > div {
        margin: 0 5px;
      }
    }

    & .available {
      font-size: 16px;
      line-height: 24px;
      margin-top: 12px;
      & .title {
        font-family: ${({ theme }) => theme.fonts.hind_regular};
        margin-right: 12px;
      }
      & .cash {
        font-family: ${({ theme }) => theme.fonts.monsterRat_Bold};
      }
    }

    & .amount {
      background: ${({ theme }) => theme.colors.bg};
      display: flex;
      border-radius: 10px;
      padding: 10px;
      justify-content: space-between;
      align-items: center;
      margin-top: 18px;
      align-self: center;
      width: 220px;
      & input {
        background: ${({ theme }) => theme.colors.bg};
        color: ${({ theme }) => theme.colors.grey};
        font-size: 16px;
        line-height: 24px;
        font-family: ${({ theme }) => theme.fonts.hind_regular};
        max-width: 150px;
        white-space: nowrap;
        border: none;
        &:focus {
          outline: none;
        }
        ::placeholder {
          color: ${({ theme }) => theme.colors.grey};
        }
      }
      & div {
        margin: 0 0 0 auto;
        text-transform: uppercase;
        & span {
          margin-right: 16px;
          margin-left: 0;
          margin-bottom: -2px;
          @media (max-width: 480px) {
            margin-right: 10px;
          }
        }
      }
      & img {
        width: 22px;
        height: 22px;
      }
    }

    & button {
      margin-top: 20px;
      max-width: 220px;
    }
  }

  .TokenList {
    margin-top: 36px;
    padding: 0 32px;
    flex-grow: 1;
    display: flex;
    position: relative;
  }
`;
