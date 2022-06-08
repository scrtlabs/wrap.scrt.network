import { useRef, useState } from 'react';
import { StyledExchange } from './styled';
import copy from '../../../../assets/images/copy.svg';

interface ExchangeProps {
  title: string,
  id: string
}

export const Exchange = ({ title, id }: ExchangeProps) => {

  const ref = useRef<HTMLSpanElement>(null)
  const [isCopied, setIsCopied] = useState(false);

  async function copyTextToClipboard(text: string) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  const handleCopyClick = () => {
    if (ref.current) {
      copyTextToClipboard(ref.current.innerText)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  return (
    <StyledExchange>
      <span className="title">{title}:</span>
      <span ref={ref} className="id">{id}</span>
      <img src={copy} alt="copy" onClick={handleCopyClick}/>
      {isCopied && <p className="copied-msg">Copied</p>}
    </StyledExchange>
  )
}