import React from 'react';
import BigNumber from 'bignumber.js';
import { SecretNetworkClient } from 'secretjs';
import { chains } from '../config';
import { CalcValues } from './Content/TokenForm/PercentOptions/PercentOptions';

export async function copyTextToClipboard(text: string) {
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand('copy', true, text);
  }
}

export const handleCopyClick = (ref: any, setIsCopied: (data: boolean) => void ) => {
  if (ref.current) {
    if (!ref.current.innerText) return
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

export const SECRET_CHAIN_ID = chains["Secret Network"].chain_id;
export const SECRET_RPC = chains["Secret Network"].rpc;

export async function setKeplrViewingKey(token: string) {
  if (!window.keplr) {
    console.error("Keplr not present");
    return;
  }

  await window.keplr.suggestToken(SECRET_CHAIN_ID, token);
}

export async function getKeplrViewingKey(
  token: string
): Promise<string | null> {
  if (!window.keplr) {
    console.error("Keplr not present");
    return null;
  }

  try {
    return await window.keplr.getSecret20ViewingKey(SECRET_CHAIN_ID, token);
  } catch (e) {
    return null;
  }
}

export async function setupKeplr(
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

export const formatBalance = (balance: BigNumber.Value, decimals: number) => {
  return new BigNumber(balance)
    .dividedBy(`1e${decimals}`)
    .toFormat()
}

export const fixedBalance = (balance: BigNumber.Value, decimals: number) => {
  return new BigNumber(balance)
    .dividedBy(`1e${decimals}`)
    .toFixed()
}

export const calculateAmount = (amount: number, part: CalcValues) => {
  const numberPercent = parseInt(part)
  return amount / 100 * numberPercent
}