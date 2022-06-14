import React, { useRef, useState } from 'react';
import { SecretNetworkClient } from 'secretjs';
import { StyledKeplr } from './styled';
import { rootIcons } from '../../../../assets/images';
import { cutString, handleCopyClick } from '../../../helpers';
import copy from '../../../../assets/images/copy.svg';

export interface KeplrProps {
  secretjs: SecretNetworkClient | null;
  secretAddress: string;
}

export function Keplr({
  secretjs,
  secretAddress,
}: KeplrProps) {

  const ref = useRef<HTMLParagraphElement>(null)
  const [isCopied, setIsCopied] = useState(false);

  const clickHandler = secretjs
    ? () => handleCopyClick(ref, setIsCopied)
    : () => {}


  return (
    <StyledKeplr onClick={clickHandler}>
      <img className="keplr" src={rootIcons.keplr} alt="keplr"/>
      <p ref={ref} className="keplr-title">
        {secretjs ? cutString(secretAddress) : "Connect wallet"}
        {isCopied && <span className="copied-msg">Copied</span>}
      </p>
      {secretjs && <img className="copy" src={copy} alt="copy"/>}
    </StyledKeplr>
  )
}
