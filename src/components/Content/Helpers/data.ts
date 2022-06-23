import { Token, Chain, ChainList } from "../../../config";
import { getKeplrViewingKey } from "./keplr";
import { SecretNetworkClient } from "secretjs";
import React from "react";

export function getPrice(
  currentToken: Token,
  setPrice: React.Dispatch<React.SetStateAction<number>>,
  setLoadingTokenPrice: React.Dispatch<React.SetStateAction<boolean>>
) {
  setLoadingTokenPrice(true);
  fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${currentToken.coingecko_id}&vs_currencies=USD`
  )
    .then((resp) => resp.json())
    .then((result: { [coingecko_id: string]: { usd: number } }) => {
      console.log(result);
      if (result[currentToken.coingecko_id]) {
        setLoadingTokenPrice(false);
        setPrice(result[currentToken.coingecko_id].usd);
        return;
      }
      setLoadingTokenPrice(false);
      setPrice(0);
    });
}

export function getMarketData(
  currentToken: Token,
  setMarketData: React.Dispatch<
    React.SetStateAction<{
      market_cap: number;
      price_change_percentage_24h: number;
    }>
  >,
  setLoadingMarketData: React.Dispatch<React.SetStateAction<boolean>>
) {
  setLoadingMarketData(true);
  fetch(
    `https://api.coingecko.com/api/v3/coins/markets?ids=${currentToken.coingecko_id}&vs_currency=USD`
  )
    .then((resp) => resp.json())
    .then((result) => {
      const searchingToken = result.find(
        (el: {
          id: string;
          market_cap: number;
          price_change_percentage_24h: number;
        }) => el.id === currentToken.coingecko_id
      );

      if (!searchingToken) {
        setLoadingMarketData(false);
        setMarketData({
          market_cap: 0,
          price_change_percentage_24h: 0,
        });
        return;
      }
      setLoadingMarketData(false);
      setMarketData({
        market_cap: searchingToken.market_cap,
        price_change_percentage_24h: searchingToken.price_change_percentage_24h,
      });

      return;
    });
}

export function getTokenBalance(
  currentToken: Token,
  secretAddress: string,
  setTokenBalance: React.Dispatch<React.SetStateAction<string>>,
  setLoadingTokenBalance: React.Dispatch<React.SetStateAction<boolean>>
) {
  setLoadingTokenBalance(true);
  const url = `${ChainList["Secret Network"].lcd}/bank/balances/${secretAddress}`;
  fetch(url)
    .then((resp) => resp.json())
    .then((result) => {
      const denom = currentToken.withdrawals[0]; //Naive assumption that withdrawals array has the necessary denom.
      const balance = result.result.find(
        (t: { denom: string; amount: string }) => t.denom === denom.from_denom
      );
      if (!balance) {
        setLoadingTokenBalance(false);
        setTokenBalance("0");
        return;
      }
      setLoadingTokenBalance(false);
      setTokenBalance(balance.amount);
      return;
    });
}

export async function getSnipBalance(
  currentToken: Token,
  secretjs: SecretNetworkClient | null,
  secretAddress: string,
  setSnipBalance: React.Dispatch<React.SetStateAction<string>>,
  setViewKeyError: React.Dispatch<React.SetStateAction<boolean>>,
  setLoadingSnipBalance: React.Dispatch<React.SetStateAction<boolean>>
) {
  if (!secretjs) return;

  setLoadingSnipBalance(true);

  const key: any = await getKeplrViewingKey(currentToken.address);
  if (!key) {
    setLoadingSnipBalance(false);
    setViewKeyError(true);
    return;
  }
  setViewKeyError(false);

  const result: { balance: { amount: string } } =
    await secretjs.query.compute.queryContract({
      contractAddress: currentToken.address,
      codeHash: currentToken.code_hash,
      query: {
        balance: {
          address: secretAddress,
          key: key,
        },
      },
    });

  if (result.viewing_key_error) {
    setLoadingSnipBalance(false);
    setViewKeyError(true);
    return;
  }
  setLoadingSnipBalance(false);
  setSnipBalance(result.balance.amount);

  return;
}
