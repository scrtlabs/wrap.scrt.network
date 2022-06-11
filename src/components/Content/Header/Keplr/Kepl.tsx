import React, { useRef, useState } from 'react';
import { SecretNetworkClient } from 'secretjs';
import { StyledKeplr } from './styled';
import { rootIcons } from '../../../../assets/images';
import { handleCopyClick, setupKeplr } from '../../../helpers';
import copy from '../../../../assets/images/copy.svg';

export interface KeplrProps {
  secretjs: SecretNetworkClient | null;
  setSecretjs: React.Dispatch<React.SetStateAction<SecretNetworkClient | null>>;
  secretAddress: string;
  setSecretAddress: React.Dispatch<React.SetStateAction<string>>;
}

export function Keplr({
  secretjs,
  setSecretjs,
  secretAddress,
  setSecretAddress,
}: KeplrProps) {

  const ref = useRef<HTMLParagraphElement>(null)
  const [isCopied, setIsCopied] = useState(false);

  const clickHandler = secretjs
    ? () => handleCopyClick(ref, setIsCopied)
    : () => setupKeplr(setSecretjs, setSecretAddress)

  return (
    <StyledKeplr onClick={clickHandler}>
      <img className="keplr" src={rootIcons.keplr} alt="keplr"/>
      <p ref={ref} className="keplr-title">
        {secretjs ? secretAddress : "Connect wallet"}
        {isCopied && <span className="copied-msg">Copied</span>}
      </p>
      {secretjs && <img className="copy" src={copy} alt="copy"/>}
    </StyledKeplr>
  )
}
