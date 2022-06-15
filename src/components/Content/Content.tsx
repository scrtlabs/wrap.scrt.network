import { useEffect, useState } from 'react';
import { SecretNetworkClient } from 'secretjs';
import { StyledContent } from './styled';
import { Header } from './Header/Header';
import { GetPrivacy } from './GetPrivacy/GetPrivacy';
import { TokenForm } from './TokenForm/TokenForm';
import { Footer } from './Footer/Footer';
import { chains, mergeStateType, TokenNames, TokenOptions, tokens } from '../../config';

interface ContentProps {
  tokenOptions: TokenOptions,
  mergeState: mergeStateType,
}

export function Content({tokenOptions, mergeState}: ContentProps) {
  const [secretjs, setSecretjs] = useState<SecretNetworkClient | null>(null);
  const [secretAddress, setSecretAddress] = useState<string>("");

  const [balances, setBalances] = useState<Map<string, string>>(new Map());
  const [prices, setPrices] = useState<Map<string, number>>(new Map());
  const [tokensData, setTokensData] = useState({});
  const [loadingCoinBalances, setLoadingCoinBalances] = useState<boolean>(false);

  const updateCoinBalances = async () => {
    const newBalances = new Map<string, string>(balances);

    const url = `${chains["Secret Network"].lcd}/bank/balances/${secretAddress}`;
    try {
      const response = await fetch(url);
      const result: {
        height: string;
        result: Array<{ denom: string; amount: string }>;
      } = await response.json();

      const denoms = Array.from(
        new Set(
          tokens.map((t) => t.withdrawals.map((w) => w.from_denom)).flat()
        )
      );

      for (const denom of denoms) {
        const balance =
          result.result.find((c) => c.denom === denom)?.amount || "0";

        newBalances.set(denom, balance);
      }
    } catch (e) {
      console.error(`Error while trying to query ${url}:`, e);
    }

    setBalances(newBalances);
  };

  useEffect(() => {
    if (!secretjs || !secretAddress) {
      return;
    }

    const interval = setInterval(updateCoinBalances, 10_000);

    (async () => {
      setLoadingCoinBalances(true);
      await updateCoinBalances();
      setLoadingCoinBalances(false);
    })();

    return () => {
      clearInterval(interval);
    };
  }, [secretAddress, secretjs]);

  useEffect(() => {
    fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokens
        .map((t) => t.coingecko_id)
        .join(",")}&vs_currencies=USD`
    )
      .then((resp) => resp.json())
      .then((result: { [coingecko_id: string]: { usd: number } }) => {
        const prices = new Map<string, number>();
        for (const token of tokens) {
          if (result[token.coingecko_id]) {
            prices.set(token.name, result[token.coingecko_id].usd);
          }
          if (token.name === "UST") {
            prices.set(token.name, 1);
          }
        }
        setPrices(prices);
      });
  }, []);

  useEffect(() => {
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?ids=${tokens
        .map((t) => t.coingecko_id)
        .join(",")}&vs_currency=USD`
    )
      .then((resp) => resp.json())
      .then((result) => {
        let tokensData = {}
        tokens.map((token) => {
          const searchingToken = result.find((el: {
            id: string,
            market_cap: number,
            price_change_percentage_24h: number
          }) => el.id === token.coingecko_id)

          if (token.name === TokenNames.ust) {
            tokensData = {
              ...tokensData,
              [token.name]: {
                market_cap: 0,
                price_change_percentage_24h: 0,
              }
            }
            return
          }

          if (searchingToken) {
            tokensData = {
              ...tokensData,
              [token.name]: {
                market_cap: searchingToken.market_cap,
                price_change_percentage_24h: searchingToken.price_change_percentage_24h,
              }
            }
          }
        })

        setTokensData(tokensData)
      });
  }, []);

  return (
    <StyledContent>
      <Header
        secretjs={secretjs}
        secretAddress={secretAddress}
        setSecretjs={setSecretjs}
        setSecretAddress={setSecretAddress}
      />
      <div className="content-wrap">
        <GetPrivacy/>
        <TokenForm
          tokenOptions={tokenOptions}
          mergeState={mergeState}
          secretjs={secretjs}
          secretAddress={secretAddress}
          balances={balances}
          prices={prices}
          loadingCoinBalances={loadingCoinBalances}
          setSecretjs={setSecretjs}
          setSecretAddress={setSecretAddress}
          tokensData={tokensData}
        />
      </div>
      <Footer/>
    </StyledContent>
  )
}