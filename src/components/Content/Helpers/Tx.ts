import { MsgExecuteContract, SecretNetworkClient } from "secretjs";
import { Token } from "../../../types";
import { BigNumber } from "bignumber.js";

interface wrappedProps {
  secretjs: SecretNetworkClient;
  secretAddress: string;
  currentToken: Token;
  wrapInputRef: React.MutableRefObject<any>;
  loadingWrap: boolean;
  loadingUnwrap: boolean;
  setLoadingWrap: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingUnwrap: React.Dispatch<React.SetStateAction<boolean>>;
}

export async function wrap({
  secretjs,
  secretAddress,
  currentToken,
  wrapInputRef,
  loadingWrap,
  loadingUnwrap,
  setLoadingWrap,
}: wrappedProps) {
  if (loadingWrap || loadingUnwrap || wrapInputRef?.current?.value === "") {
    return;
  }

  setLoadingWrap(true);
  const baseAmount = wrapInputRef?.current?.value;
  const amount = new BigNumber(baseAmount)
    .multipliedBy(`1e${currentToken.decimals}`)
    .toFixed(0, BigNumber.ROUND_DOWN);
  if (amount === "NaN") {
    setLoadingWrap(false);
    return;
  }
  try {
    const tx = await secretjs.tx.broadcast(
      [
        new MsgExecuteContract({
          sender: secretAddress,
          contractAddress: currentToken.address,
          codeHash: currentToken.code_hash,
          sentFunds: [
            { denom: currentToken.withdrawals[0].from_denom, amount },
          ],
          msg: { deposit: {} },
        }),
      ],
      {
        gasLimit: 40_000,
        gasPriceInFeeDenom: 0.0125,
        feeDenom: "uscrt",
      }
    );
    if (tx.code === 0) {
      wrapInputRef.current.value = "";
    }
  } finally {
    setLoadingWrap(false);
    return;
  }
}

export async function unwrap({
  secretjs,
  secretAddress,
  currentToken,
  wrapInputRef,
  loadingWrap,
  loadingUnwrap,
  setLoadingUnwrap,
}: wrappedProps) {
  if (loadingWrap || loadingUnwrap || wrapInputRef?.current?.value === "") {
    return;
  }
  const baseAmount = wrapInputRef?.current?.value;
  const amount = new BigNumber(baseAmount)
    .multipliedBy(`1e${currentToken.decimals}`)
    .toFixed(0, BigNumber.ROUND_DOWN);
  if (amount === "NaN") {
    setLoadingUnwrap(false);
    return;
  }
  setLoadingUnwrap(true);
  try {
    const tx = await secretjs.tx.broadcast(
      [
        new MsgExecuteContract({
          sender: secretAddress,
          contractAddress: currentToken.address,
          codeHash: currentToken.code_hash,
          sentFunds: [],
          msg: {
            redeem: {
              amount,
              denom:
                currentToken.name === "SCRT"
                  ? undefined
                  : currentToken.withdrawals[0].from_denom,
            },
          },
        }),
      ],
      {
        gasLimit: 40_000,
        gasPriceInFeeDenom: 0.25,
        feeDenom: "uscrt",
      }
    );
    if (tx.code === 0) {
      wrapInputRef.current.value = "";
    }
  } finally {
    setLoadingUnwrap(false);
    return;
  }
}
