import React, { useRef, useState, useEffect, FC } from 'react';
import { StyledAccordionWrapper } from './styled';

interface AccordionProps {
  question: string,
  children: React.ReactNode,
}

export const Accordion: FC<AccordionProps> = ({
  question,
  children,
}) => {

  const contentRef = useRef<HTMLDivElement>(null);

  const [isOpenAccordion, setIsOpenAccordion] = useState<boolean>(false);
  const [contentHeight, setContentHeight] = useState<number>(0);

  const toggleAccordion = () => setIsOpenAccordion((prevState) => !prevState);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.offsetHeight)
    }
  }, [])

  return (
    <StyledAccordionWrapper onClick={toggleAccordion} isOpenAccordion={isOpenAccordion} contentHeight={contentHeight}>
      <div className="accordion">
        <div className="question-wrapper">
          <div className="question">
            {question}
          </div>
        </div>
        <div className="accordion__icon">
          <Arrow/>
        </div>
      </div>
      <div className="content">
        <span className="divider"/>
        <div className="answer" ref={contentRef}>
          {children}
        </div>
      </div>
    </StyledAccordionWrapper>
  );
};


const Arrow = () => {
  return (
    <svg className="arrow-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M11.707 13.8787L4.41415 6.58577L2.99994 7.99999L11.707 16.7071L20.4142 7.99999L18.9999 6.58577L11.707 13.8787Z" fill="black"/>
    </svg>
  )
}