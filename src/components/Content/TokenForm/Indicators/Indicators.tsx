import { StyledIndicators } from "./styled";
import { rootIcons } from "../../../../assets/images";
import { formatNumber, usdString } from "../../Helpers/format";

interface IndicatorsProps {
  marketCap: number;
  price: number;
  priceChange: number;
}

export const Indicators = ({
  marketCap,
  price,
  priceChange,
}: IndicatorsProps) => {
  const formattedPriceChange = formatNumber(priceChange);
  const PriceChangeHour = () => {
    if (formattedPriceChange > 0) {
      return (
        <>
          <span className="grow">{`${formattedPriceChange}%`}</span>
          <img className="grow-img" src={rootIcons.grow} alt="grow" />
        </>
      );
    }
    if (formattedPriceChange < 0) {
      return (
        <>
          <span className="fall">{`${formattedPriceChange}%`}</span>
          <img className="fall-img" src={rootIcons.fall} alt="grow" />
        </>
      );
    }

    return (
      <>
        <span>{`${formattedPriceChange}%`}</span>
      </>
    );
  };

  return (
    <StyledIndicators>
      <div className="indicator">
        <span className="title">Market Cap:</span>
        <span>{usdString.format(marketCap)}</span>
      </div>

      <div className="indicator">
        <span className="title">Price:</span>
        <span>{usdString.format(formatNumber(price))}</span>
      </div>

      <div className="indicator">
        <span className="title">24H%:</span>
        <PriceChangeHour />
      </div>
    </StyledIndicators>
  );
};
