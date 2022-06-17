import React, { useEffect, useRef, useState } from "react";
import { StyledTokenForm } from "./styled";
import { Tab, Tabs } from "../../Tabs/Tabs";
import { UnWrappedToken, WrappedToken } from "./WrappedTokens/WrappedTokens";
import { PercentOptions } from "./PercentOptions/PercentOptions";
import { Button } from "../../Button/Button";
import { Indicators } from "./Indicators/Indicators";
import { TokenList } from "./TokenList/TokenList";
import {
  mergeStateType,
  Percents,
  Token,
  TokensData,
  TokenOptions,
  tokens,
} from "../../../config";
import { rootIcons } from "../../../assets/images";
import { SecretNetworkClient } from "secretjs";
import { sleep, viewingKeyErrorString } from "../../../commons";
import {
  getKeplrViewingKey,
  setKeplrViewingKey,
  setupKeplr,
} from "../Helpers/keplr";
import { getPrice, getMarketData, getBalance } from "../Helpers/dataRequests";
import {
  fixedBalance,
  formatBalance,
  formatNumber,
  usdString,
} from "..//Helpers/format";
import BigNumber from "bignumber.js";
import { Loader } from "../Loader/Loader";
import { Deposit } from "./Deposit/Deposit";
import { Withdraw } from "./Withdraw/Withdraw";
import { wrap, unwrap } from "../Helpers/Tx";

interface TokenFormProps {
  tokenOptions: TokenOptions;
  mergeState: mergeStateType;
  secretjs: SecretNetworkClient | null;
  secretAddress: string;
  setSecretjs: React.Dispatch<React.SetStateAction<SecretNetworkClient | null>>;
  setSecretAddress: React.Dispatch<React.SetStateAction<string>>;
  token: Token;
}
function getCurrentToken(tokenOptions: TokenOptions): Token {
  return tokens.find((token) => token.name === tokenOptions.name)!;
}
export function TokenForm({
  tokenOptions,
  mergeState,
  secretjs,
  secretAddress,
  setSecretjs,
  setSecretAddress,
  token,
}: TokenFormProps) {
  let count = 0;

  const [tokenBalance, setTokenBalance] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [marketData, setMarketData] = useState<{
    market_cap: number;
    price_change_percentage_24h: number;
  }>({ market_cap: 0, price_change_percentage_24h: 0 });
  const [isWrapToken, setIsWrapToken] = useState(true);
  const wrapTitle = isWrapToken ? "wrap" : "unwrap";
  const wrapInputRef = useRef<any>();
  const [loadingWrap, setLoadingWrap] = useState<boolean>(false);
  const [loadingUnwrap, setLoadingUnwrap] = useState<boolean>(false);
  const [loadingTokenBalance, setLoadingTokenBalance] =
    useState<boolean>(false);
  const [loadingCoinBalances, setLoadingCoinBalances] =
    useState<boolean>(false);
  const [percent, setPercent] = useState("");
  const [errorBtnClass, setErrorBtnClass] = useState<string>("");

  const toggleWrappedTokens = () => setIsWrapToken((prev) => !prev);

  useEffect(() => {
    getPrice(token, setPrice, tokenOptions);
    getMarketData(token, setMarketData);
  }, [tokenOptions]);

  const updateTokenBalance = async () => {
    if (!secretjs) {
      return;
    }

    const key = await getKeplrViewingKey(token.address);
    if (!key) {
      setTokenBalance(viewingKeyErrorString);
      return;
    }

    try {
      const result = await secretjs.query.compute.queryContract({
        address: token.address,
        codeHash: token.code_hash,
        query: {
          balance: { address: secretAddress, key },
        },
      });

      if (result.viewing_key_error) {
        setTokenBalance(viewingKeyErrorString);
        return;
      }
      setTokenBalance(result.balance.amount);
    } catch (e) {
      console.error(`Error getting balance for s${token.name}`, e);

      setTokenBalance(viewingKeyErrorString);
    }
  };

  const refresh = async () => {
    try {
      setLoadingTokenBalance(true);
      await updateTokenBalance();
    } finally {
      setLoadingTokenBalance(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoadingTokenBalance(true);
        await updateTokenBalance();
      } finally {
        setLoadingTokenBalance(false);
      }
    })();
  }, [secretjs]);

  return (
    <StyledTokenForm>
      <Tabs
        currentTab={"wrap"}
        disableTabsOnchange={!!secretAddress}
        setErrorBtnClass={setErrorBtnClass}
      >
        <Tab tabKey={"wrap"} title={wrapTitle}>
          <div className="wrapped-elems">
            {isWrapToken ? (
              <>
                <WrappedToken refresh={refresh} tokenOptions={tokenOptions} />
                <img
                  className="swap"
                  src={rootIcons.swap}
                  alt="swap"
                  onClick={toggleWrappedTokens}
                />
                <UnWrappedToken refresh={refresh} tokenOptions={tokenOptions} />
              </>
            ) : (
              <>
                <UnWrappedToken refresh={refresh} tokenOptions={tokenOptions} />
                <img
                  className="swap"
                  src={rootIcons.swap}
                  alt="swap"
                  onClick={toggleWrappedTokens}
                />
                <WrappedToken refresh={refresh} tokenOptions={tokenOptions} />
              </>
            )}
          </div>

          <PercentOptions setPercent={setPercent} cb={() => {}} />

          <div className="count">
            <input type="number" placeholder="Amount" ref={wrapInputRef} />
          </div>

          {secretjs ? (
            <Button title={wrapTitle} action={isWrapToken ? wrap : unwrap} />
          ) : (
            <Button
              errorClass={errorBtnClass}
              title={"Connect wallet"}
              action={() => setupKeplr(setSecretjs, setSecretAddress)}
            />
          )}

          <Indicators
            marketCap={marketData.market_cap}
            price={price}
            priceChange={marketData.price_change_percentage_24h}
          />
        </Tab>

        <Tab tabKey={"bridge"} title={"bridge (ibc)"}>
          {/* <div className="deposit-withdraw-tabs">
            <Tabs currentTab={"deposit"} isDivider>
              <Tab tabKey={"deposit"} title={"deposit"}>
                <Deposit
                  tokenOptions={tokenOptions}
                  token={token}
                  secretAddress={secretAddress}
                  onSuccess={(txhash) => {
                    console.log("success", txhash);
                  }}
                  onFailure={(error) => console.error(error)}
                />
              </Tab>
              <Tab tabKey={"withdraw"} title={"withdraw"}>
                <Withdraw
                  token={token}
                  secretjs={secretjs}
                  secretAddress={secretAddress}
                  balances={balances}
                  onSuccess={(txhash) => {
                    console.log("success", txhash);
                  }}
                  onFailure={(error) => console.error(error)}
                />
              </Tab>
            </Tabs>
          </div> */}
        </Tab>
      </Tabs>

      <TokenList
        list={tokens}
        activeTokenName={tokenOptions.name}
        setTokenOptions={mergeState}
      />
    </StyledTokenForm>
  );
}
