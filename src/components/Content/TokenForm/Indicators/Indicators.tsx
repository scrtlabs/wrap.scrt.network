import { StyledIndicators } from './styled';
import { rootIcons } from '../../../../assets/images';

interface IndicatorsProps {
  capitalization?: string
  price: string
  changeCoefficient?: string
}

export const Indicators = ({ capitalization, price = "$1.96", changeCoefficient }: IndicatorsProps) => {
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
        <span className="grow">{changeCoefficient}</span>
        <img className="grow-img" src={rootIcons.grow} alt="grow"/>
      </div>

    </StyledIndicators>
  )
}