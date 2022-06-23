import React, { useEffect, useRef, useState } from "react";
import { StyledTokenForm } from "./styled";
import { Tab, Tabs } from "../../Tabs/Tabs";
import { UnwrappedToken, WrappedToken } from "./WrappedTokens/WrappedTokens";

import { Button } from "../../Button/Button";
import { Indicators } from "./Indicators/Indicators";

import { TokenList } from "./TokenList/TokenList";
import {
  mergeStateType,
  TokenOptions,
  TokensList,
  TokensMarketData,
  Token,
} from "../../../config";
import { rootIcons } from "../../../assets/images";
import { SecretNetworkClient } from "secretjs";
import { getCurrentToken } from "../../../commons";
import { setupKeplr } from "../Helpers/keplr";
import { getPrice, getMarketData } from "../Helpers/data";

import { Deposit } from "./Deposit/Deposit";
import { Withdraw } from "./Withdraw/Withdraw";
import { wrap, unwrap } from "../Helpers/tx";

interface TokenFormProps {
  mergeState: mergeStateType;
  secretjs: SecretNetworkClient | null;
  secretAddress: string;
  setSecretjs: React.Dispatch<React.SetStateAction<SecretNetworkClient | null>>;
  setSecretAddress: React.Dispatch<React.SetStateAction<string>>;
  currentToken: Token;
}

export function TokenForm({
  mergeState,
  secretjs,
  secretAddress,
  setSecretjs,
  setSecretAddress,
  currentToken,
}: TokenFormProps) {
  const [tokenPrice, setTokenPrice] = useState<number>(0);
  const [marketData, setMarketData] = useState<TokensMarketData>({
    market_cap: 0,
    price_change_percentage_24h: 0,
  });

  const [isWrapToken, setIsWrapToken] = useState(true);
  const wrapTitle = isWrapToken ? "wrap" : "unwrap";
  const wrapInputRef = useRef<any>();

  const [loadingWrap, setLoadingWrap] = useState<boolean>(false);
  const [loadingUnwrap, setLoadingUnwrap] = useState<boolean>(false);

  const [loadingMarketData, setLoadingMarketData] = useState<boolean>(false);
  const [loadingTokenPrice, setLoadingTokenPrice] = useState<boolean>(false);
  const [loadingTokenBalance, setLoadingTokenBalance] =
    useState<boolean>(false);

  const [errorBtnClass, setErrorBtnClass] = useState<string>("");

  const toggleWrappedTokens = () => setIsWrapToken((prev) => !prev);

  useEffect(() => {
    getPrice(currentToken, setTokenPrice, setLoadingTokenPrice);
    getMarketData(currentToken, setMarketData, setLoadingMarketData);

    let interval = setInterval(() => {
      getPrice(currentToken, setTokenPrice, setLoadingTokenPrice);
      getMarketData(currentToken, setMarketData, setLoadingMarketData);
    }, 6_000);

    return () => {
      clearInterval(interval);
    };
  }, [currentToken]);

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
                <UnwrappedToken
                  currentToken={currentToken}
                  secretjs={secretjs}
                  secretAddress={secretAddress}
                  tokenPrice={tokenPrice}
                />
                <img
                  className="swap"
                  src={rootIcons.swap}
                  alt="swap"
                  onClick={toggleWrappedTokens}
                />
                <WrappedToken
                  currentToken={currentToken}
                  secretjs={secretjs}
                  secretAddress={secretAddress}
                  tokenPrice={tokenPrice}
                />
              </>
            ) : (
              <>
                <WrappedToken
                  currentToken={currentToken}
                  secretjs={secretjs}
                  secretAddress={secretAddress}
                  tokenPrice={tokenPrice}
                />
                <img
                  className="swap"
                  src={rootIcons.swap}
                  alt="swap"
                  onClick={toggleWrappedTokens}
                />
                <UnwrappedToken
                  currentToken={currentToken}
                  secretjs={secretjs}
                  secretAddress={secretAddress}
                  tokenPrice={tokenPrice}
                />
              </>
            )}
          </div>

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
            tokenPrice={tokenPrice}
            priceChange={marketData.price_change_percentage_24h}
            loadingTokenPrice={loadingTokenPrice}
            loadingMarketData={loadingMarketData}
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
        list={TokensList}
        activeTokenName={currentToken.name}
        setTokenOptions={mergeState}
      />
    </StyledTokenForm>
  );
}
