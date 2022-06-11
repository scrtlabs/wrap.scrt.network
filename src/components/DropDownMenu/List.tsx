import React, { FC } from 'react';
import { StyledList } from './styled';
import { DropDownMenuItem } from './DropDownMenu';

interface ListProps {
  list: DropDownMenuItem[],
  callback?: (data: any) => void,
}

export const List: FC<ListProps> = ({
  list,
  callback
}) => {

  const itemHandler = (data: any) => {
    if (callback){
      callback(data)
    }
  }

  return (
    <StyledList>
      <div className="items-list">
        {list.map(({ name, image }, idx ) => (
          <div key={name} className="item" onClick={() => itemHandler({idx, name, image})}>
            {image && <img src={image} alt=""/>}
            <p className="title">{name}</p>
          </div>
        ))}
      </div>
    </StyledList>
  );
}

