import { useState } from 'react';
import { StyledTokenForm } from './styled';
import { Tab, Tabs } from '../../Tabs/Tabs';
import { WrappedToken } from './WrappedTokens/WrappedTokens';
import { PercentOptions } from './PercentOptions/PercentOptions';
import { Button } from '../../Button/Button';
import { Indicators } from './Indicators/Indicators';
import { TokenList } from './TokenList/TokenList';
import { DropDownMenu } from '../../DropDownMenu/DropDownMenu';
import { Exchange } from './Exchange/Exchange';

import { mergeStateType, TokenOptions, tokens } from '../../../config';
import { rootIcons } from '../../../assets/images';


interface TokenFormProps {
  tokenOptions: TokenOptions,
  mergeState: mergeStateType,
}

export function TokenForm({ tokenOptions, mergeState }: TokenFormProps) {
  const [isWrapToken, setIsWrapToken] = useState(true)
  const toggleWrappedTokens = () => setIsWrapToken(prev => !prev)
  const wrapTitle = isWrapToken ? 'wrap' : 'unwrap'

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
          <Indicators/>
        </Tab>

        <Tab tabKey={'bridge'} title={'bridge (ibc)'}>
          <div className="deposit-withdraw-tabs">
            <Tabs currentTab={'deposit'} isDivider={true}>
              <Tab tabKey={'deposit'} title={'deposit'}>
                <div className="deposit-block">
                  <p>Deposit SCRT from</p>
                  <DropDownMenu
                    list={tokens}
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
                  <span className="title">Amont to Deposit</span>
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