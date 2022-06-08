import React, { useState } from 'react';
import { StyledDropDownMenu } from './styled';
import { List } from './List';


interface DropDownMenuProps {
  list: DropDownMenuItem[],
  activeItem: string,
  activeIcon?: string,
  showOnline?: boolean,
  isUpperCaseTitle?: boolean,
  callback?: (data: any) => void,
}

export interface DropDownMenuItem {
  title: string,
  src?: string,
}

export const DropDownMenu = ({
  list,
  activeItem,
  activeIcon = "",
  showOnline = false,
  isUpperCaseTitle = false,
  callback = () => {},
}: DropDownMenuProps) => {
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false);
  const toggleMenu = (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
    setIsShowMenu((prev => !prev));
  };

  return (
    <StyledDropDownMenu isShowMenu={isShowMenu} onClick={toggleMenu} isUpperCaseTitle={isUpperCaseTitle}>
      <div className="items-block">
        <div className="active-item">
          {activeIcon && <img src={activeIcon} alt=""/>}
          {showOnline && <div className="circle"><span className="circle-inner"/></div>}
          <p className="active-item-name">{activeItem && activeItem}</p>
          <Arrow/>
        </div>
        {isShowMenu &&
          <List
            list={list}
            isUpperCaseTitle={isUpperCaseTitle}
            callback={callback}
          />
        }
      </div>
    </StyledDropDownMenu>
  );
};

const Arrow = () => {
  return (
    <svg className="arrow-icon" width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 11.5L8 6.5L3 11.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}