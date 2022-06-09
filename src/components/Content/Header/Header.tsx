import { StyledHeader } from './styled';
import { rootIcons } from '../../../assets/images';
import { DropDownMenu, DropDownMenuItem } from '../../DropDownMenu/DropDownMenu';
import { Keplr, KeplrProps } from './Keplr/Kepl';

export function Header({
  secretjs,
  setSecretjs,
  secretAddress,
  setSecretAddress,
}: KeplrProps) {

  const list: DropDownMenuItem[] = [
    {name: "Secret-4"},
    // {name: "Pulsar-2"},
  ]

  return (
    <StyledHeader>
      <img className="logo" src={rootIcons.logo} alt="logo"/>
      <div className="wallet">
        <DropDownMenu
          list={list}
          activeItem={list[0].name}
          showOnline={true}
        />
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