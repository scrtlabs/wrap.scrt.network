import { useState } from 'react';
import { SecretNetworkClient } from 'secretjs';
import { StyledContent } from './styled';
import { Header } from './Header/Header';
import { GetPrivacy } from './GetPrivacy/GetPrivacy';
import { TokenForm } from './TokenForm/TokenForm';
import { Footer } from './Footer/Footer';
import { mergeStateType, TokenOptions } from '../../config';

interface ContentProps {
  tokenOptions: TokenOptions,
  mergeState: mergeStateType,
}

export function Content({tokenOptions, mergeState}: ContentProps) {
  const [secretjs, setSecretjs] = useState<SecretNetworkClient | null>(null);
  const [secretAddress, setSecretAddress] = useState<string>("");

  return (
    <StyledContent>
      <Header
        secretjs={secretjs}
        setSecretjs={setSecretjs}
        secretAddress={secretAddress}
        setSecretAddress={setSecretAddress}
      />
      <div className="content-wrap">
        <GetPrivacy/>
        <TokenForm tokenOptions={tokenOptions} mergeState={mergeState}/>
      </div>
      <Footer/>
    </StyledContent>
  )
}