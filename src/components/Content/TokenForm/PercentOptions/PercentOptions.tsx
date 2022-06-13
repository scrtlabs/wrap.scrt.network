import { StyledPercentOptions } from './styled';
import { Percents } from '../../../../config';

interface PercentOptionsProps {
  percent: Percents
  setPercent: (percents: Percents) => void
  cb: (v: Percents) => void
}

export const PercentOptions = ({percent, setPercent, cb}: PercentOptionsProps) => {
  const countValues = [Percents.v25, Percents.v50, Percents.v75, Percents.v100]

  const handler = (el: Percents) => {
    cb(el)
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
          {el === Percents.v100 ? 'Max' : el}
        </span>
      )}
    </StyledPercentOptions>
  )
}