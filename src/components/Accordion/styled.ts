import styled from 'styled-components';

export const StyledAccordionWrapper = styled.div<{
  isOpenAccordion: boolean,
  contentHeight: number,
}>` && {
  max-width: 800px;
  border-radius: 5px;
  overflow: hidden;

  & .accordion {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    cursor: pointer;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.white};

    & .question-wrapper {
      display: flex;
      flex-direction: column;

      & .question {
        font-family: 'Hind Regular', sans-serif;
        font-size: 16px;
        line-height: 24px;
      }
    }

    & .accordion__icon {
      user-select: none;
      display: flex;

      & .arrow-icon {
        width: 15px;
        height: 15px;
        cursor: pointer;
        margin-left: 5px;
        transition: 0.35s ease-out;
        transform: ${({ isOpenAccordion }) => (isOpenAccordion ? 'rotate(0deg)' : 'rotate(-90deg)')};

        & path {
          fill: ${({ theme }) => theme.colors.white};
        }
      }
    }
  }

  & .content {
    transition: height 0.35s ease-out;
    cursor: pointer;
    height: ${({ isOpenAccordion, contentHeight }) => (isOpenAccordion ? `${contentHeight}px` : '0')};
    background: ${({ theme }) => theme.colors.bg};

    & .divider {
      display: block;
      height: 1px;
      max-width: calc(100% - 80px);
      background: ${({ theme }) => `linear-gradient(90deg, #232042 0%, ${theme.colors.orange} 50%, #232042 100%)`};
      margin: 0 auto;
      @media (max-width: 480px) {
        max-width: 100%
      }
    }

    & .answer {
      padding: 20px;
      color: ${({ theme }) => theme.colors.white};
      font-family: 'Hind Regular', sans-serif;
      font-size: 16px;
      line-height: 24px;
    }
  }
}`;
