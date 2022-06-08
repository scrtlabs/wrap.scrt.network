import { SetStateAction, useState } from 'react';
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { BackGround } from './components/BackGround/BackGround';
import { Content } from './components/Content/Content';
import { mergeStateType, TokenNames, TokenOptions } from './config';
import { tokenIcons } from './assets/images';

declare global {
  interface Window extends KeplrWindow {}
}

function App() {
  const [tokenOptions, setTokenOptions] = useState<TokenOptions>({
    name: TokenNames.scrt,
    image: tokenIcons.scrt
  })

  const mergeState: mergeStateType = (data, value) => {
    if (typeof data === 'object') {
      setTokenOptions((prevState: SetStateAction<any>) => ({ ...prevState, ...data }))
    } else {
      setTokenOptions(prevState => ({ ...prevState, [data]: value }))
    }
  }

  return (
    <div className="App">
      <BackGround activeToken={tokenOptions.name}/>
      <Content tokenOptions={tokenOptions} mergeState={mergeState}/>
    </div>
  )
}

export default App
