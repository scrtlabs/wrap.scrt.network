import { useRef, useState } from 'react';
import { StyledExchange } from './styled';
import { handleCopyClick } from '../../../helpers';
import copy from '../../../../assets/images/copy.svg';

interface ExchangeProps {
  title: string,
  id: string
}

export const Exchange = ({ title, id }: ExchangeProps) => {

  const ref = useRef<HTMLSpanElement>(null)
  const [isCopied, setIsCopied] = useState(false);

  return (
    <StyledExchange>
      <span className="title">{title}:</span>
      <span ref={ref} className="id">{id}</span>
      <img src={copy} alt="copy" onClick={() => handleCopyClick(ref, setIsCopied)}/>
      {isCopied && <p className="copied-msg">Copied</p>}
    </StyledExchange>
  )
}