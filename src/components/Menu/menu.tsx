import React, { Context, FunctionComponentElement, useState } from "react";
import { MenuItemProps } from "./menuItem";
import classNames from "classnames";

type mode = "horizontal" | "vertical"; // 支持垂直和水平
type onSelectType = (selectIndex: string) => void;

interface MenuItemContextType {
  active: string;
  onSelect?: onSelectType;
  mode?: string;
  defaultOpenSubMenus?: string[];
}

export interface MenuProps {
  defaultIndex?: string;
  className?: string;
  mode?: mode;
  style?: React.CSSProperties;
  onSelect?: onSelectType;
  defaultOpenSubMenus?: string[];
}

export const MenuContext = React.createContext<MenuItemContextType>({
  active: "0",
});

const Menu: React.FC<MenuProps> = (props) => {
  const { className, defaultIndex, mode, style, onSelect, children,defaultOpenSubMenus } = props;
  const [active, setActive] = useState(defaultIndex);

  const handleClick = (index: string) => {
    setActive(index);
    // 触发上层转过来的事件
    onSelect && onSelect(index);
  };
  const MenuItemContext: MenuItemContextType = {
    active: active ? active : "0",
    onSelect: handleClick,
    mode,
    defaultOpenSubMenus
  };

  const classes = classNames("viking-menu", className, {
    "menu-vertical": mode === "vertical",
    "menu-horizontal": mode !== "vertical",
  });

  return (
    <ul className={classes} style={style} data-testid="Menu-test-id">
      <MenuContext.Provider value={MenuItemContext}>
        {
          //children
          React.Children.map(children, (child, index) => {
            const MenuItemElement = child as FunctionComponentElement<
              MenuItemProps
            >;
            const FunctionComponent = MenuItemElement.type;
            const { displayName } = FunctionComponent;
            if (displayName === "MenuItem" || displayName === "SubMenu") {
              return React.cloneElement(MenuItemElement, {
                index: index.toString(),
              });
            } else {
              console.error("子组件存在其它元素");
            }
          })
        }
      </MenuContext.Provider>
    </ul>
  );
};

Menu.defaultProps = {
  defaultIndex: "0",
  mode: "horizontal",
  defaultOpenSubMenus:[]
};

export default Menu;
