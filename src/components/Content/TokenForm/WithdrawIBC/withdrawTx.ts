import { SecretNetworkClient, MsgTransfer } from "secretjs";
import { BigNumber } from "bignumber.js";
import { Token, Chain } from "../../../../types";
import { gasToFee } from "../../../../commons";
import { getIBCBalance, getTokenBalance } from "../../Helpers/data";
import React from "react";

export async function withdrawTx(
  secretjs: SecretNetworkClient | null,
  inputRef: React.MutableRefObject<any>,
  targetChain: Chain,
  addressIBC: string,
  secretAddress: string,
  currentToken: Token,
  selectedChainIndex: number,
  loadingWithdrawal: boolean,
  setLoadingWithdrawal: React.Dispatch<React.SetStateAction<boolean>>,
  setTokenBalance: React.Dispatch<React.SetStateAction<string>>,
  setLoadingTokenBalance: React.Dispatch<React.SetStateAction<boolean>>
) {
  if (!secretjs || loadingWithdrawal || inputRef?.current?.value === "") {
    return;
  }
  const normalizedAmount = (inputRef.current.value as string).replace(/,/g, "");
  if (!(Number(normalizedAmount) > 0)) {
    console.error(`${normalizedAmount} not bigger than 0`);
    return;
  }
  setLoadingWithdrawal(true);

  const amount = new BigNumber(normalizedAmount)
    .multipliedBy(`1e${currentToken.decimals}`)
    .toFixed(0, BigNumber.ROUND_DOWN);
  const { withdraw_channel_id, withdraw_gas } = targetChain;

  try {
    const tx = await secretjs.tx.broadcast(
      [
        new MsgTransfer({
          sender: secretAddress,
          receiver: addressIBC,
          sourceChannel: withdraw_channel_id,
          sourcePort: "transfer",
          token: {
            amount,
            denom: currentToken.withdrawals[selectedChainIndex].from_denom,
          },
          timeoutTimestampSec: String(Math.floor(Date.now() / 1000) + 15 * 60), // 15 minute timeout
        }),
      ],
      {
        gasLimit: withdraw_gas,
        gasPriceInFeeDenom: 0.25,
        feeDenom: "uscrt",
      }
    );
    if (tx.code === 0) {
      inputRef.current.value = "";
    }
  } finally {
    setLoadingWithdrawal(false);
    getTokenBalance(
      currentToken,
      secretAddress,
      setTokenBalance,
      setLoadingTokenBalance
    );

    return;
  }
}
