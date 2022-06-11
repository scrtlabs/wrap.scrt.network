import { rootIcons, tokenIcons } from '../../../../assets/images';
import { StyledWrapElem } from './styled';

interface WrappedTokenProps {
  tokenOptions: { name: string, image: string },
  refresh: () => void,
  children: JSX.Element
}

export const WrappedToken = ({tokenOptions, refresh, children}: WrappedTokenProps) => {
  return (
    <StyledWrapElem>
      <div className="img-wrap">
        <img className="big-img" src={tokenOptions.image} alt=""/>
      </div>

      <div className="cash-wrap">
        <p className="scrt">0 <span>{tokenOptions.name}</span></p>
        <div className="content">
          {children}
        </div>
        <img className="refresh" src={rootIcons.refresh} alt="" onClick={refresh}/>
      </div>
    </StyledWrapElem>
  )
}

export const UnWrappedToken = ({tokenOptions, refresh, children}: WrappedTokenProps) => {
  return (
    <StyledWrapElem>
      <div className="img-wrap">
        <img className="big-img" src={tokenOptions.image} alt=""/>
        <img className="small-img" src={tokenIcons.scrt} alt=""/>
      </div>

      <div className="cash-wrap">
        <p className="scrt">0 s
          <span>{tokenOptions.name}</span>
        </p>
        <div className="content">
          {children}
        </div>
        <img className="refresh" src={rootIcons.refresh} alt="" onClick={refresh}/>
      </div>
    </StyledWrapElem>
  )
}


