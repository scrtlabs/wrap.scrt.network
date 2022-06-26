import { SigningStargateClient } from "@cosmjs/stargate";
import { BigNumber } from "bignumber.js";
import { Token, Chain } from "../../../../types";
import { gasToFee } from "../../../../commons";
import { getIBCBalance } from "../../Helpers/data";
import React from "react";

export async function depositTx(
  cosmjs: SigningStargateClient | null,
  inputRef: React.MutableRefObject<any>,
  targetChain: Chain,
  addressIBC: string,
  secretAddress: string,
  currentToken: Token,
  selectedChainIndex: number,
  loadingDeposit: boolean,
  setLoadingDeposit: React.Dispatch<React.SetStateAction<boolean>>,
  setBalanceIBC: React.Dispatch<React.SetStateAction<string>>,
  setLoadingBalanceIBC: React.Dispatch<React.SetStateAction<boolean>>
) {
  if (!cosmjs || loadingDeposit || inputRef?.current?.value === "") {
    return;
  }

  const normalizedAmount = (inputRef.current.value as string).replace(/,/g, "");
  if (!(Number(normalizedAmount) > 0)) {
    console.error(`${normalizedAmount} not bigger than 0`);
    return;
  }
  setLoadingDeposit(true);

  const amount = new BigNumber(normalizedAmount)
    .multipliedBy(`1e${currentToken.decimals}`)
    .toFixed(0, BigNumber.ROUND_DOWN);
  const { deposit_channel_id, deposit_gas } = targetChain;

  try {
    const { transactionHash } = await cosmjs.sendIbcTokens(
      addressIBC,
      secretAddress,
      {
        amount,
        denom: currentToken.deposits[selectedChainIndex].from_denom,
      },
      "transfer",
      deposit_channel_id,
      undefined,
      Math.floor(Date.now() / 1000) + 15 * 60, // 15 minute timeout
      gasToFee(deposit_gas)
    );
    inputRef.current.value = "";
  } finally {
    setLoadingDeposit(false);
    getIBCBalance(
      addressIBC,
      currentToken,
      selectedChainIndex,
      setBalanceIBC,
      setLoadingBalanceIBC
    );
    return;
  }
}
