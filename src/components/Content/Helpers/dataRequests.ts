import { Token, TokenOptions } from "../../../config";
import React from "react";

export function getPrice(
  token: Token,
  setPrice: React.Dispatch<React.SetStateAction<number>>,
  tokenOptions: TokenOptions
) {
  console.log(token, tokenOptions);
  fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${token.coingecko_id}&vs_currencies=USD`
  )
    .then((resp) => resp.json())
    .then((result: { [coingecko_id: string]: { usd: number } }) => {
      if (result[token.coingecko_id]) {
        setPrice(result[token.coingecko_id].usd);
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
      }
    });
}

// export function getBalance() {
//   console.log(source);
//   const newBalances = new Map<string, string>(balances);

//   const url = `${chains["Secret Network"].lcd}/bank/balances/${secretAddress}`;
//   try {
//     const response = await fetch(url);
//     const result: {
//       height: string;
//       result: Array<{ denom: string; amount: string }>;
//     } = await response.json();
//     const denoms = Array.from(
//       new Set(tokens.map((t) => t.withdrawals.map((w) => w.from_denom)).flat())
//     );

//     for (const denom of denoms) {
//       const balance =
//         result.result.find((c) => c.denom === denom)?.amount || "0";

//       newBalances.set(denom, balance);
//     }
//   } catch (e) {
//     console.error(`Error while trying to query ${url}:`, e);
//   }
//   setBalances(newBalances);
// }
