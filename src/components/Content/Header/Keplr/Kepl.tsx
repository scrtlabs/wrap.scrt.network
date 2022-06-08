import React, { useRef, useState } from 'react';
import { SecretNetworkClient } from 'secretjs';
import { StyledKeplr } from './styled';
import { rootIcons } from '../../../../assets/images';
import { handleCopyClick, SECRET_CHAIN_ID, SECRET_RPC } from '../../../helpers';
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

async function setupKeplr(
  setSecretjs: React.Dispatch<React.SetStateAction<SecretNetworkClient | null>>,
  setSecretAddress: React.Dispatch<React.SetStateAction<string>>
) {
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  while (
    !window.keplr ||
    !window.getEnigmaUtils ||
    !window.getOfflineSignerOnlyAmino
    ) {
    await sleep(50);
  }

  await window.keplr.enable(SECRET_CHAIN_ID);

  const keplrOfflineSigner = window.getOfflineSignerOnlyAmino(SECRET_CHAIN_ID);
  const accounts = await keplrOfflineSigner.getAccounts();

  const secretAddress = accounts[0].address;

  const secretjs = await SecretNetworkClient.create({
    grpcWebUrl: SECRET_RPC,
    chainId: SECRET_CHAIN_ID,
    wallet: keplrOfflineSigner,
    walletAddress: secretAddress,
    encryptionUtils: window.getEnigmaUtils(SECRET_CHAIN_ID),
  });

  setSecretAddress(secretAddress);
  setSecretjs(secretjs);
}
