import { useState } from 'react';
import { StyledPercentOptions } from './styled';

export const PercentOptions = () => {
  const countValues = ['25%', '50%', '75%', 'Max']
  const [count, setCount] = useState('25%')
  return (
    <StyledPercentOptions>
      {countValues.map((el, idx) =>
        <span
          className={`${el === count ? 'active' : ''}`}
          onClick={() => setCount(el)}
          key={idx}
        >
          {el}
        </span>
      )}
    </StyledPercentOptions>
  )
}