import { MsgExecuteContract, SecretNetworkClient } from "secretjs";
export const wrap = async () => {
  // if (!secretjs || !secretAddress || loadingWrap || loadingUnwrap) {
  //   return;
  // }
  // const baseAmount = wrapInputRef?.current?.value;
  // const amount = new BigNumber(baseAmount)
  //   .multipliedBy(`1e${token.decimals}`)
  //   .toFixed(0, BigNumber.ROUND_DOWN);
  // if (amount === "NaN") {
  //   console.error("NaN amount", baseAmount);
  //   return;
  // }
  // setLoadingWrap(true);
  // try {
  //   const tx = await secretjs.tx.broadcast(
  //     [
  //       new MsgExecuteContract({
  //         sender: secretAddress,
  //         contract: token.address,
  //         codeHash: token.code_hash,
  //         sentFunds: [{ denom: token.withdrawals[0].from_denom, amount }],
  //         msg: { deposit: {} },
  //       }),
  //     ],
  //     {
  //       gasLimit: 40_000,
  //       gasPriceInFeeDenom: 0.25,
  //       feeDenom: "uscrt",
  //     }
  //   );
  //   if (tx.code === 0) {
  //     wrapInputRef.current.value = "";
  //     console.log(`Wrapped successfully`);
  //   } else {
  //     console.error(`Tx failed: ${tx.rawLog}`);
  //   }
  // } finally {
  //   setLoadingWrap(false);
  //   try {
  //     setLoadingTokenBalance(true);
  //     await sleep(1000); // sometimes query nodes lag
  //     await updateTokenBalance();
  //   } finally {
  //     setLoadingTokenBalance(false);
  //   }
  // }
};

export const unwrap = async () => {
  //     if (!secretjs || !secretAddress || loadingWrap || loadingUnwrap) {
  //       return;
  //     }
  //     const baseAmount = wrapInputRef?.current?.value;
  //     const amount = new BigNumber(baseAmount)
  //       .multipliedBy(`1e${token.decimals}`)
  //       .toFixed(0, BigNumber.ROUND_DOWN);
  //     if (amount === "NaN") {
  //       console.error("NaN amount", baseAmount);
  //       return;
  //     }
  //     setLoadingUnwrap(true);
  //     try {
  //       const tx = await secretjs.tx.broadcast(
  //         [
  //           new MsgExecuteContract({
  //             sender: secretAddress,
  //             contract: token.address,
  //             codeHash: token.code_hash,
  //             sentFunds: [],
  //             msg: {
  //               redeem: {
  //                 amount,
  //                 denom:
  //                   token.name === "SCRT"
  //                     ? undefined
  //                     : token.withdrawals[0].from_denom,
  //               },
  //             },
  //           }),
  //         ],
  //         {
  //           gasLimit: 40_000,
  //           gasPriceInFeeDenom: 0.25,
  //           feeDenom: "uscrt",
  //         }
  //       );
  //       if (tx.code === 0) {
  //         wrapInputRef.current.value = "";
  //         console.log(`Unwrapped successfully`);
  //       } else {
  //         console.error(`Tx failed: ${tx.rawLog}`);
  //       }
  //     } finally {
  //       setLoadingUnwrap(false);
  //       try {
  //         setLoadingTokenBalance(true);
  //         await sleep(1000); // sometimes query nodes lag
  //         await updateTokenBalance();
  //       } finally {
  //         setLoadingTokenBalance(false);
  //       }
  //     }
};
