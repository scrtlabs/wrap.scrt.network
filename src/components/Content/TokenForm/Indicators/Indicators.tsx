import { StyledIndicators } from './styled';
import { rootIcons } from '../../../../assets/images';
import { formatNumber } from '../../../helpers';

interface IndicatorsProps {
  marketCap?: string
  price: string
  priceChange: number
}

export const Indicators = ({ marketCap, price, priceChange }: IndicatorsProps) => {

  const formattedPrice = formatNumber(priceChange)

  const PriceChangeHour = () => {
    if (formattedPrice > 0) {
      return (
        <>
          <span className="grow">{`${formattedPrice}%`}</span>
          <img className="grow-img" src={rootIcons.grow} alt="grow"/>
        </>
      )
    }
    if (formattedPrice < 0) {
      return (
        <>
          <span className="fall">{`${formattedPrice}%`}</span>
          <img className="fall-img" src={rootIcons.fall} alt="grow"/>
        </>
      )
    }

    return (
      <>
        <span>{`${formattedPrice}%`}</span>
      </>
    )
  }

  return (
    <StyledIndicators>
      <div className="indicator">
        <span className="title">Market cap</span>
        <span>{marketCap}</span>
      </div>

      <div className="indicator">
        <span className="title">Price</span>
        <span>{price}</span>
      </div>

      <div className="indicator">
        <span className="title">24H</span>
        <PriceChangeHour/>
      </div>

    </StyledIndicators>
  )
}