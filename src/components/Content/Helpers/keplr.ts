import { SecretNetworkClient } from "secretjs";
import React from "react";
import { chains } from "../../../config";

export async function setKeplrViewingKey(
  token: string,
  setViewKeyError: React.Dispatch<React.SetStateAction<boolean>>
) {
  if (!window.keplr) {
    return;
  }

  await window.keplr.suggestToken(chains["Secret Network"].chain_id, token);
  setViewKeyError(false);
  return;
}

export async function getKeplrViewingKey(
  token: string
): Promise<string | null> {
  if (!window.keplr) {
    return null;
  }

  try {
    return await window.keplr.getSecret20ViewingKey(
      chains["Secret Network"].chain_id,
      token
    );
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

  await window.keplr.enable(chains["Secret Network"].chain_id);

  const keplrOfflineSigner = window.getOfflineSignerOnlyAmino(
    chains["Secret Network"].chain_id
  );
  const accounts = await keplrOfflineSigner.getAccounts();

  const secretAddress = accounts[0].address;

  const secretjs = await SecretNetworkClient.create({
    grpcWebUrl: chains["Secret Network"].rpc,
    chainId: chains["Secret Network"].chain_id,
    wallet: keplrOfflineSigner,
    walletAddress: secretAddress,
    encryptionUtils: window.getEnigmaUtils(chains["Secret Network"].chain_id),
  });

  setSecretAddress(secretAddress);
  setSecretjs(secretjs);
}
