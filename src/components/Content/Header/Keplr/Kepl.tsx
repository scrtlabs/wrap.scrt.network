import { StyledKeplr } from './styled';
import { rootIcons } from '../../../../assets/images';

export function Keplr({title = "connect keplr"}) {
  return (
    <StyledKeplr>
      <img src={rootIcons.keplr} alt="keplr"/>
      <p className="keplr-title">
        {title}
      </p>
    </StyledKeplr>
  )
}
