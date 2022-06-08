import { StyledIndicators } from './styled';
import { rootIcons } from '../../../../assets/images';

export const Indicators = ({ capitalization = "$320,709.510", price = "$1.96", timeChange = '2.53%' }) => {
  return (
    <StyledIndicators>
      <div className="indicator">
        <span className="title">Market cap</span>
        <span>{capitalization}</span>
      </div>

      <div className="indicator">
        <span className="title">Price</span>
        <span>{price}</span>
      </div>

      <div className="indicator">
        <span className="title">24H</span>
        <span className="grow">{timeChange}</span>
        <img className="grow-img" src={rootIcons.grow} alt="grow"/>
      </div>

    </StyledIndicators>
  )
}