import { StyledHeader } from "./styled";
import { rootIcons } from "../../../assets/images";
import {
  DropDownMenu,
  DropDownMenuItem,
} from "../../DropDownMenu/DropDownMenu";
import { Keplr, KeplrProps } from "./Keplr/Keplr";

export function Header({
  secretjs,
  secretAddress,
  setSecretjs,
  setSecretAddress,
}: KeplrProps) {
  const list: DropDownMenuItem[] = [
    { name: "Secret-4" },
    // {name: "Pulsar-2"},
  ];

  return (
    <StyledHeader>
      <img className="logo" src={rootIcons.logo} alt="logo" />
      <div className="wallet">
        {/* <DropDownMenu
          list={list}
          activeItem={list[0].name}
          showOnline={true}
        /> */}
        <Keplr
          secretjs={secretjs}
          secretAddress={secretAddress}
          setSecretjs={setSecretjs}
          setSecretAddress={setSecretAddress}
        />
      </div>
    </StyledHeader>
  );
}
