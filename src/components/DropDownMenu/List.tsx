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
        {list.map(({ name, image }: DropDownMenuItem) => (
          <div key={name} className="item" onClick={() => itemHandler({name, image})}>
            {image && <img src={image} alt=""/>}
            <p className="title">{name}</p>
          </div>
        ))}
      </div>
    </StyledList>
  );
}

