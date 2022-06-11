import { useState } from 'react';
import { StyledPercentOptions } from './styled';

export enum CalcValues {
  v25 = '25%',
  v50 = '50%',
  v75 = '75%',
  v100 = '100%',
}

export const PercentOptions = ({}) => {
  const countValues = [CalcValues.v25, CalcValues.v50, CalcValues.v75, CalcValues.v100]
  const [percent, setPercent] = useState(CalcValues.v100)

  const handler = (el: CalcValues) => {
    setPercent(el)
  }

  return (
    <StyledPercentOptions>
      {countValues.map((el, idx) =>
        <span
          className={`${el === percent ? 'active' : ''}`}
          onClick={() => handler(el)}
          key={idx}
        >
          {el === CalcValues.v100 ? 'Max' : el}
        </span>
      )}
    </StyledPercentOptions>
  )
}