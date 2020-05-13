import React, { useContext, useState, FunctionComponentElement } from "react";
import classNames from "classnames";
import { MenuContext } from "./menu";
import { MenuItemProps } from "./menuItem";

export interface SubMenuProps {
  index?: string;
  title: string;
  className?: string;
}

const SubMenu: React.FC<SubMenuProps> = (props) => {
    const { children, index, title, className } = props;
  const context = useContext(MenuContext);
  const {defaultOpenSubMenus} = context
  const isOpend = (index && context.mode === 'vertical') ? (defaultOpenSubMenus as Array<string>).includes(index) : false
  const [subMenu, setSubMenu] = useState(isOpend);
  const handleVerticalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setSubMenu(!subMenu);
  };
  let timer: any
  const handleMouse = (e:React.MouseEvent,toggle:boolean)=>{
    clearTimeout(timer)
    e.preventDefault()
    timer = setTimeout(() => {
        setSubMenu(toggle)
    }, 300)
  }
  const vClickEvent =
    context.mode === "vertical" ? { onClick: handleVerticalClick } : {};
  const hMoveEvent = context.mode === "vertical" ? {} : {
    onMouseEnter:(e:React.MouseEvent)=>{handleMouse(e, true)},
    onMouseLeave:(e:React.MouseEvent)=>{handleMouse(e, false)},
  };

  const renderChild = () => {
    const subMenuClasses = classNames("viking-submenu", {
      "menu-opened": subMenu,
    });
    const childrenComponent = React.Children.map(children, (child, index2) => {
      const childElement = child as FunctionComponentElement<MenuItemProps>;
      if (childElement.type.displayName === "MenuItem") {
        return React.cloneElement(childElement, {
          index: `${index}-${index2}`,
        });
      } else {
        console.error(
          "Warning: SubMenu has a child which is not a MenuItem component"
        );
      }
    });
    return <ul className={subMenuClasses}>{childrenComponent}</ul>;
  };
  const classes = classNames("menu-item submenu-item", className, {
    "is-active": context.active === index || context.active[0] === index,
    /*     "is-opened": menuOpen,//控制图标
    "is-vertical": context.mode === "vertical", */
  });
  console.log('subactiv',context.active,index)
  return (
    <li key={index} className={classes}  {...hMoveEvent}>
      <div className="submenu-title" {...vClickEvent}>{title}</div>
      {renderChild()}
    </li>
  );
};

SubMenu.displayName = "SubMenu";

export default SubMenu;
