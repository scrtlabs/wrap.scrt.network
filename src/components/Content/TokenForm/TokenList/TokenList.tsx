import { StyledTokenList } from './styled';
import { tokens } from '../../../tokens';
import { mergeStateType } from '../../../../types';

interface TokenListProps {
  activeTokenName: string,
  setTokenOptions: mergeStateType,
}

export const TokenList = ({ setTokenOptions, activeTokenName }: TokenListProps) => {
  return (
    <StyledTokenList>
      {tokens.map(({ title, src }) => {
        const active = title === activeTokenName ? "active" : "";
        return (
          <li className={`token-wrap ${active}`} key={title} onClick={() => setTokenOptions({ title, src })}>
            <img src={src} alt={title}/>
            <span className="name">{title}</span>
          </li>
        )
      })}
    </StyledTokenList>
  )
}