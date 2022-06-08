import { StyledHeader } from './styled';
import { rootIcons } from '../../../assets/images';
import { DropDownMenu } from '../../DropDownMenu/DropDownMenu';
import { fakeDDLiST } from '../../../fake';
import { Keplr } from './Keplr/Kepl';

export function Header() {
  return (
    <StyledHeader>
      <img className="logo" src={rootIcons.logo} alt="logo"/>
      <div className="wallet">
        <DropDownMenu list={fakeDDLiST} activeItem={fakeDDLiST[0].name} showOnline={true}/>
        <Keplr/>
      </div>
    </StyledHeader>
  )
}