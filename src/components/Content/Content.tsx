import { StyledContent } from './styled';
import { Header } from './Header/Header';
import { GetPrivacy } from './GetPrivacy/GetPrivacy';
import { TokenForm } from './TokenForm/TokenForm';
import { Footer } from './Footer/Footer';
import { mergeStateType, TokenOptions } from '../../types';

interface ContentProps {
  tokenOptions: TokenOptions,
  mergeState: mergeStateType,
}

export function Content({tokenOptions, mergeState}: ContentProps) {
  return (
    <StyledContent>
      <Header/>
      <div className="content-wrap">
        <GetPrivacy/>
        <TokenForm tokenOptions={tokenOptions} mergeState={mergeState}/>
      </div>
      <Footer/>
    </StyledContent>
  )
}