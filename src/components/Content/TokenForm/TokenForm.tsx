import React, { useEffect, useRef, useState } from 'react';
import { StyledTokenForm } from './styled';
import { Tab, Tabs } from '../../Tabs/Tabs';
import { UnWrappedToken, WrappedToken } from './WrappedTokens/WrappedTokens';
import { PercentOptions } from './PercentOptions/PercentOptions';
import { Button } from '../../Button/Button';
import { Indicators } from './Indicators/Indicators';
import { TokenList } from './TokenList/TokenList';

import { mergeStateType, Percents, Token, TokensData, TokenOptions, tokens } from '../../../config';
import { rootIcons } from '../../../assets/images';
import { MsgExecuteContract, SecretNetworkClient } from 'secretjs';
import { sleep, viewingKeyErrorString } from '../../../commons';
import {
  fixedBalance,
  formatBalance, formatNumber,
  getKeplrViewingKey,
  setKeplrViewingKey,
  setupKeplr,
  usdString
} from '../../helpers';
import BigNumber from 'bignumber.js';
import { Loader } from '../Loader/Loader';
import { Deposit } from './Deposit/Deposit';
import { Withdraw } from './Withdraw/Withdraw';


interface TokenFormProps {
  tokenOptions: TokenOptions,
  mergeState: mergeStateType,
  secretjs: SecretNetworkClient | null,
  secretAddress: string,
  balances: Map<string, string>,
  prices: Map<string, number>,
  loadingCoinBalances: boolean,
  setSecretjs: React.Dispatch<React.SetStateAction<SecretNetworkClient | null>>,
  setSecretAddress: React.Dispatch<React.SetStateAction<string>>,
  tokensData: TokensData,
}

export function TokenForm({
  tokenOptions,
  mergeState,
  secretjs,
  secretAddress,
  balances,
  prices,
  loadingCoinBalances,
  setSecretjs,
  setSecretAddress,
  tokensData,
}: TokenFormProps) {
  const [isWrapToken, setIsWrapToken] = useState(true)
  const toggleWrappedTokens = () => setIsWrapToken(prev => !prev)
  const wrapTitle = isWrapToken ? 'wrap' : 'unwrap'
  const [token, setToken] = useState<Token>(getCurrentToken())
  const [price, setPrice] = useState<number>(getTokenPrice())
  const wrapInputRef = useRef<any>();
  const [loadingWrap, setLoadingWrap] = useState<boolean>(false);
  const [loadingUnwrap, setLoadingUnwrap] = useState<boolean>(false);
  const [tokenBalance, setTokenBalance] = useState<string>("");
  const [loadingTokenBalance, setLoadingTokenBalance] = useState<boolean>(false);
  const [percent, setPercent] = useState(Percents.v100)
  const [errorBtnClass, setErrorBtnClass] = useState<string>('')

  function getCurrentToken (){
    return tokens.find((token) => token.name === tokenOptions.name)!
  }

  function getTokenPrice() {
    const price = prices.get(token.name)!

    return formatNumber(price)
  }

  useEffect(() => {
    setToken(getCurrentToken())
    setPrice(getTokenPrice())
  }, [tokenOptions.name])

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
  }
  const wrap = async () => {
    if (
      !secretjs ||
      !secretAddress ||
      loadingWrap ||
      loadingUnwrap
    ) {
      return;
    }
    const baseAmount = wrapInputRef?.current?.value;
    const amount = new BigNumber(baseAmount)
      .multipliedBy(`1e${token.decimals}`)
      .toFixed(0, BigNumber.ROUND_DOWN);
    if (amount === "NaN") {
      console.error("NaN amount", baseAmount);
      return;
    }
    setLoadingWrap(true);
    try {
      const tx = await secretjs.tx.broadcast(
        [
          new MsgExecuteContract({
            sender: secretAddress,
            contract: token.address,
            codeHash: token.code_hash,
            sentFunds: [
              { denom: token.withdrawals[0].from_denom, amount },
            ],
            msg: { deposit: {} },
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
        console.log(`Wrapped successfully`);
      } else {
        console.error(`Tx failed: ${tx.rawLog}`);
      }
    } finally {
      setLoadingWrap(false);
      try {
        setLoadingTokenBalance(true);
        await sleep(1000); // sometimes query nodes lag
        await updateTokenBalance();
      } finally {
        setLoadingTokenBalance(false);
      }
    }
  }

  const unwrap = async () => {
    if (!secretjs || !secretAddress || loadingWrap || loadingUnwrap) {
      return;
    }

    const baseAmount = wrapInputRef?.current?.value;
    const amount = new BigNumber(baseAmount).multipliedBy(`1e${token.decimals}`).toFixed(0, BigNumber.ROUND_DOWN);

    if (amount === "NaN") {
      console.error("NaN amount", baseAmount);
      return;
    }

    setLoadingUnwrap(true);

    try {
      const tx = await secretjs.tx.broadcast(
        [
          new MsgExecuteContract({
            sender: secretAddress,
            contract: token.address,
            codeHash: token.code_hash,
            sentFunds: [],
            msg: {
              redeem: {
                amount,
                denom:
                  token.name === "SCRT"
                    ? undefined
                    : token.withdrawals[0].from_denom,
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
        console.log(`Unwrapped successfully`);
      } else {
        console.error(`Tx failed: ${tx.rawLog}`);
      }
    } finally {
      setLoadingUnwrap(false);
      try {
        setLoadingTokenBalance(true);
        await sleep(1000); // sometimes query nodes lag
        await updateTokenBalance();
      } finally {
        setLoadingTokenBalance(false);
      }
    }
  }

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

  const denomOnSecret = token.withdrawals[0]?.from_denom;
  let balanceIbcCoin;
  let balanceToken;

  const calculateBalancePart = (balance: string) => {
    const numberPercent = parseInt(percent)
    const balancePart = Number(balance) / 100 * numberPercent

    if (balance === "NaN" || !balance) {
      return ""
    }

    return String(balancePart)
  }

  if (loadingCoinBalances) {
    balanceIbcCoin = <Loader/>
  } else if (balances.get(denomOnSecret)) {
    balanceIbcCoin = (
      <div>
        <div onClick={() => {
          const balance = fixedBalance(balances.get(denomOnSecret)!, token.decimals)
          wrapInputRef.current.value = calculateBalancePart(balance)
        }}>
          {`Balance: ${formatBalance(balances.get(denomOnSecret)!, token.decimals)}`}
        </div>
        <div>
          {usdString.format(new BigNumber(balances.get(denomOnSecret)!)
            .dividedBy(`1e${token.decimals}`)
            .multipliedBy(price)
            .toNumber())}
        </div>
      </div>
    );
  } else {
    balanceIbcCoin = <></>
  }

  if (!secretjs) {
    balanceToken = <></>
  } else if (loadingTokenBalance) {
    balanceToken = <Loader/>
  } else if (tokenBalance == viewingKeyErrorString) {
    balanceToken = (
      <div
        className="set-key"
        onClick={async () => {
          await setKeplrViewingKey(token.address);
          try {
            setLoadingTokenBalance(true);
            await sleep(1000); // sometimes query nodes lag
            await updateTokenBalance();
          } finally {
            setLoadingTokenBalance(false);
          }
        }}
      >
        Set Viewing Key
      </div>
    );
  } else if (Number(tokenBalance) > -1) {
    balanceToken = (
      <div>
        <div onClick={() => {
          const balance = fixedBalance(tokenBalance, token.decimals)
          wrapInputRef.current.value = calculateBalancePart(balance)
        }}>
          {`Balance: ${formatBalance(tokenBalance, token.decimals)}`}
        </div>
        <div>
          {usdString.format(new BigNumber(tokenBalance)
            .dividedBy(`1e${token.decimals}`)
            .multipliedBy(price)
            .toNumber())}
        </div>
      </div>
    );
  } else {
    balanceToken = <></>
  }

  return (
    <StyledTokenForm>
      <Tabs currentTab={'wrap'} disableTabsOnchange={!(!!secretAddress)} setErrorBtnClass={setErrorBtnClass}>
        <Tab tabKey={'wrap'} title={wrapTitle}>
          <div className="wrapped-elems">
            {isWrapToken ?
              <>
                <WrappedToken refresh={refresh} tokenOptions={tokenOptions} children={balanceIbcCoin}/>
                <img className="swap" src={rootIcons.swap} alt="swap" onClick={toggleWrappedTokens}/>
                <UnWrappedToken refresh={refresh} tokenOptions={tokenOptions} children={balanceToken}/>
              </>
              :
              <>
                <UnWrappedToken refresh={refresh} tokenOptions={tokenOptions} children={balanceToken}/>
                <img className="swap" src={rootIcons.swap} alt="swap" onClick={toggleWrappedTokens}/>
                <WrappedToken refresh={refresh} tokenOptions={tokenOptions} children={balanceIbcCoin}/>
              </>
            }
          </div>

          <PercentOptions percent={percent} setPercent={setPercent} cb={() => {}} />

          <div className="count">
            <input ref={wrapInputRef}/>
          </div>

          {secretjs
            ? <Button title={wrapTitle} action={isWrapToken ? wrap : unwrap}/>
            : <Button
                errorClass={errorBtnClass}
                title={'Connect wallet'}
                action={() => setupKeplr(setSecretjs, setSecretAddress)}
              />
          }

          <Indicators
            marketCap={`${ usdString.format(tokensData[token.name]?.market_cap || 0)}`}
            price={`$${getTokenPrice()}`}
            priceChange={tokensData[token.name]?.price_change_percentage_24h || 0}
          />
        </Tab>

        <Tab tabKey={'bridge'} title={'bridge (ibc)'}>
          <div className="deposit-withdraw-tabs">
            <Tabs currentTab={'deposit'} isDivider>
              <Tab tabKey={'deposit'} title={'deposit'}>
                <Deposit
                  tokenOptions={tokenOptions}
                  token={token}
                  secretAddress={secretAddress}
                  onSuccess={(txhash) => {console.log("success", txhash)}}
                  onFailure={(error) => console.error(error)}
                />
              </Tab>
              <Tab tabKey={'withdraw'} title={'withdraw'}>
                <Withdraw
                  token={token}
                  secretjs={secretjs}
                  secretAddress={secretAddress}
                  balances={balances}
                  onSuccess={(txhash) => {console.log("success", txhash)}}
                  onFailure={(error) => console.error(error)}
                />
              </Tab>
            </Tabs>
          </div>
        </Tab>
      </Tabs>

      <TokenList
        list={tokens}
        activeTokenName={tokenOptions.name}
        setTokenOptions={mergeState}
      />
    </StyledTokenForm>
  )
}