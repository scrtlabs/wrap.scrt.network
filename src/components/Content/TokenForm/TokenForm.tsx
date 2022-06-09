import { useEffect, useState } from 'react';
import { StyledTokenForm } from './styled';
import { Tab, Tabs } from '../../Tabs/Tabs';
import { WrappedToken } from './WrappedTokens/WrappedTokens';
import { PercentOptions } from './PercentOptions/PercentOptions';
import { Button } from '../../Button/Button';
import { Indicators } from './Indicators/Indicators';
import { TokenList } from './TokenList/TokenList';
import { DropDownMenu } from '../../DropDownMenu/DropDownMenu';
import { Exchange } from './Exchange/Exchange';

import { mergeStateType, Token, TokenOptions, tokens } from '../../../config';
import { rootIcons } from '../../../assets/images';
import { SecretNetworkClient } from 'secretjs';
import { viewingKeyErrorString } from '../../../commons';
import { getKeplrViewingKey } from '../../helpers';


interface TokenFormProps {
  tokenOptions: TokenOptions,
  mergeState: mergeStateType,
  secretjs: SecretNetworkClient | null,
  secretAddress: string,
  balances: Map<string, string>,
  prices: Map<string, number>,
  loadingCoinBalances: boolean,
}

export function TokenForm({
  tokenOptions,
  mergeState,
  secretjs,
  secretAddress,
  balances,
  prices,
  loadingCoinBalances,
}: TokenFormProps) {
  const [isWrapToken, setIsWrapToken] = useState(true)
  const toggleWrappedTokens = () => setIsWrapToken(prev => !prev)
  const wrapTitle = isWrapToken ? 'wrap' : 'unwrap'
  const [token, setToken] = useState<Token>(getCurrentToken())
  const [price, setPrice] = useState<number>(getTokenPrice())

  const [loadingWrap, setLoadingWrap] = useState<boolean>(false);
  const [loadingUnwrap, setLoadingUnwrap] = useState<boolean>(false);
  const [tokenBalance, setTokenBalance] = useState<string>("");
  const [loadingTokenBalance, setLoadingTokenBalance] = useState<boolean>(false);
  const [isDepositWithdrawDialogOpen, setIsDepositWithdrawDialogOpen] = useState<boolean>(false);

  function getCurrentToken (){
    return tokens.find((token) => token.name === tokenOptions.name)!
  }

  function getTokenPrice (){
    return prices.get(token.name) || 0
  }

  useEffect(() => {
    setToken(getCurrentToken())
    setPrice(getTokenPrice())
  }, [tokenOptions.name])

  const updateTokenBalance = async () => {
    if (!token.address) {
      return;
    }

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

  return (
    <StyledTokenForm>
      <Tabs currentTab={'wrap'}>
        <Tab tabKey={'wrap'} title={wrapTitle}>
          <div className="wrapped-elems">
            <WrappedToken tokenName={tokenOptions.name} tokenSrc={tokenOptions.image} isWrapped={!isWrapToken}/>
            <img className="swap" src={rootIcons.swap} alt="swap" onClick={toggleWrappedTokens}/>
            <WrappedToken tokenName={tokenOptions.name} tokenSrc={tokenOptions.image} isWrapped={isWrapToken}/>
          </div>

          <PercentOptions/>

          <div className="count">
            <p>0</p>
          </div>

          <Button title={wrapTitle}/>
          <Indicators price={`$${getTokenPrice()}`}/>
        </Tab>

        <Tab tabKey={'bridge'} title={'bridge (ibc)'}>
          <div className="deposit-withdraw-tabs">
            <Tabs currentTab={'deposit'} isDivider={true}>
              <Tab tabKey={'deposit'} title={'deposit'}>
                <div className="deposit-block">
                  <p>Deposit SCRT from</p>
                  <DropDownMenu
                    list={tokens.filter(token => token.address)}
                    callback={mergeState}
                    activeItem={tokenOptions.name}
                    activeIcon={tokenOptions.image}
                    isUpperCaseTitle={true}
                  />
                  <p>to Secret Network</p>
                </div>

                <Exchange title="From" id="ce2dst1g3zmlq...a9463j"/>
                <Exchange title="To" id="secret1g3zmlq...a9463j"/>

                <div className="available">
                  <span className="title">Available to deposit:</span>
                  <span className="cash">0 SCRT</span>
                </div>

                <div className="amount">
                  <span className="title">Amount to Deposit</span>
                  <PercentOptions/>
                  <img src={tokenOptions.image} alt="amount"/>
                </div>

                <Button title={"deposit"}/>
              </Tab>
              <Tab tabKey={'withdraw'} title={'withdraw'}>

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