import React, { useContext } from 'react'
import {MenuContext} from './menu'
import classNames from 'classnames'

export interface MenuItemProps {
    index?: string;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
  }
  

  const MenuItem: React.FC<MenuItemProps> = (props) => {
    const { index, disabled, className, style, children } = props
    console.log(disabled)
    const context = useContext(MenuContext)
    const classes = classNames('menu-item', className, {
        'is-disabled': disabled,
        'is-active': context.active === index
      })
    const handleClick = () => {
        if (context.onSelect && !disabled && (typeof index === 'string')) {
          context.onSelect(index)
        }
      }
    return (
      <li  style={style} onClick={handleClick} className={classes}>
        {children}
      </li>
    )
  }

  MenuItem.displayName = 'MenuItem'
  
  //MenuItem.displayName = 'MenuItem'
  export default MenuItem