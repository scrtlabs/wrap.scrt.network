import { SetStateAction, useState } from 'react';
import { BackGround } from './components/BackGround/BackGround';
import { Content } from './components/Content/Content';
import { mergeStateType, TokenOptions, Tokens } from './types';
import { tokenIcons } from './assets/images';

function App() {
  const [tokenOptions, setTokenOptions] = useState<TokenOptions>({
    title: Tokens.scrt,
    src: tokenIcons.scrt
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
      <BackGround activeToken={tokenOptions.title}/>
      <Content tokenOptions={tokenOptions} mergeState={mergeState}/>
    </div>
  )
}

export default App
