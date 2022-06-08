import { StyledFooter } from './styled';
import { socialIcons } from '../../../assets/images';

export function Footer() {
  return (
    <StyledFooter>
      <a href="" target="_blank">
        <img src={socialIcons.network} alt="network"/>
      </a>
      <a href="" target="_blank">
        <img src={socialIcons.twitter} alt="twitter"/>
      </a>
      <a href="" target="_blank">
        <img src={socialIcons.git} alt="git"/>
      </a>
    </StyledFooter>
  )
}