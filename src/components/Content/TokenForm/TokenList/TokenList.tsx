import { StyledTokenList } from './styled';
import { mergeStateType, Token } from '../../../../config';

interface TokenListProps {
  activeTokenName: string,
  setTokenOptions: mergeStateType,
  list: Token[],
}

export const TokenList = ({ setTokenOptions, activeTokenName, list }: TokenListProps) => {
  return (
    <StyledTokenList>
      {list.map(({ name, image }) => {
        const active = name === activeTokenName ? "active" : "";
        return (
          <li className={`token-wrap ${active}`} key={name} onClick={() => setTokenOptions({ name, image })}>
            <img src={image} alt={name}/>
            <span className="name">{name}</span>
          </li>
        )
      })}
    </StyledTokenList>
  )
}