import { StyledHeader } from './styled';
import { rootIcons } from '../../../assets/images';
import { DropDownMenu } from '../../DropDownMenu/DropDownMenu';
import { fakeDDLiST } from '../../../fake';
import { Keplr, KeplrProps } from './Keplr/Kepl';

export function Header({
  secretjs,
  setSecretjs,
  secretAddress,
  setSecretAddress,
}: KeplrProps) {
  return (
    <StyledHeader>
      <img className="logo" src={rootIcons.logo} alt="logo"/>
      <div className="wallet">
        <DropDownMenu list={fakeDDLiST} activeItem={fakeDDLiST[0].name} showOnline={true}/>
        <Keplr
          secretjs={secretjs}
          setSecretjs={setSecretjs}
          secretAddress={secretAddress}
          setSecretAddress={setSecretAddress}
        />
      </div>
    </StyledHeader>
  )
}