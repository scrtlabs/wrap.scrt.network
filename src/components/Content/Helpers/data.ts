import { Token, TokenOptions, Chain, tokens, chains } from "../../../config";
import { getKeplrViewingKey, setKeplrViewingKey } from "./keplr";
import { SecretNetworkClient } from "secretjs";
import React from "react";

export function getPrice(
  token: Token,
  setPrice: React.Dispatch<React.SetStateAction<number>>
) {
  fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${token.coingecko_id}&vs_currencies=USD`
  )
    .then((resp) => resp.json())
    .then((result: { [coingecko_id: string]: { usd: number } }) => {
      if (result[token.coingecko_id]) {
        setPrice(result[token.coingecko_id].usd);
        return;
      }
    });
}

export function getMarketData(
  token: Token,
  setMarketData: React.Dispatch<
    React.SetStateAction<{
      market_cap: number;
      price_change_percentage_24h: number;
    }>
  >
) {
  fetch(
    `https://api.coingecko.com/api/v3/coins/markets?ids=${token.coingecko_id}&vs_currency=USD`
  )
    .then((resp) => resp.json())
    .then((result) => {
      const searchingToken = result.find(
        (el: {
          id: string;
          market_cap: number;
          price_change_percentage_24h: number;
        }) => el.id === token.coingecko_id
      );

      if (searchingToken) {
        setMarketData({
          market_cap: searchingToken.market_cap,
          price_change_percentage_24h:
            searchingToken.price_change_percentage_24h,
        });
        return;
      }
    });
}

export function getTokenBalance(
  token: Token,
  secretAddress: string,
  setTokenBalance: React.Dispatch<React.SetStateAction<string>>
) {
  const url = `${chains["Secret Network"].lcd}/bank/balances/${secretAddress}`;
  fetch(url)
    .then((resp) => resp.json())
    .then((result) => {
      const denom = token.withdrawals[0]; //Naive assumption that withdrawals array has the necessary denom.
      const balance = result.result.find(
        (t: { denom: string; amount: string }) => t.denom === denom.from_denom
      ).amount;
      setTokenBalance(balance);
      return;
    });
}

export async function getSnipBalance(
  token: Token,
  secretjs: SecretNetworkClient | null,
  secretAddress: string,
  setSnipBalance: React.Dispatch<React.SetStateAction<string>>,
  setViewKeyError: React.Dispatch<React.SetStateAction<boolean>>
) {
  if (!secretjs) return;

  const key: any = await getKeplrViewingKey(token.address);

  if (!key) {
    setViewKeyError(true);
    return;
  }
  const result: { balance: { amount: string } } =
    await secretjs.query.compute.queryContract({
      contractAddress: token.address,
      codeHash: token.code_hash,
      query: {
        balance: {
          address: secretAddress,
          key: key,
        },
      },
    });
  console.log(result);
  setSnipBalance(result.balance.amount);
  return;
}
