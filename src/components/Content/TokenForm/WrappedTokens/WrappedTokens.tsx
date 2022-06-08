import { rootIcons, tokenIcons } from '../../../../assets/images';
import { StyledWrapElem } from './styled';

interface WrappedTokenProps {
  tokenSrc: string,
  tokenName: string,
  isWrapped: boolean
}

export const WrappedToken = ({tokenSrc, tokenName, isWrapped}: WrappedTokenProps) => {
  return (
    <StyledWrapElem>
      <div className="img-wrap">
        <img className="big-img" src={tokenSrc} alt=""/>
        {isWrapped && <img className="small-img" src={tokenIcons.scrt} alt=""/>}
      </div>

      <div className="cash-wrap">
        <p className="scrt">0 {isWrapped ? 's' : ""}<span>{tokenName}</span></p>
        <p className="cash">$0</p>
        <img className="refresh" src={rootIcons.refresh} alt=""/>
      </div>
    </StyledWrapElem>
  )
}

