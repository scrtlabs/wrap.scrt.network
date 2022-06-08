import React, { FC } from 'react';
import { StyledList } from './styled';
import { DropDownMenuItem } from './DropDownMenu';

interface ListProps {
  list: DropDownMenuItem[],
  isUpperCaseTitle: boolean,
  callback?: (data: any) => void,
}

export const List: FC<ListProps> = ({
  list,
  isUpperCaseTitle,
  callback
}) => {

  const itemHandler = (data: any) => {
    if (callback){
      callback(data)
    }
  }

  return (
    <StyledList isUpperCaseTitle={isUpperCaseTitle}>
      <div className="items-list">
        {list.map(({ title, src }: DropDownMenuItem) => (
          <div key={title} className="item" onClick={() => itemHandler({title, src})}>
            {src && <img src={src} alt=""/>}
            <p className="title">{title}</p>
          </div>
        ))}
      </div>
    </StyledList>
  );
}

