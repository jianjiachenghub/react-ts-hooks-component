
import Menu, { MenuProps } from './menu'
import MenuItem, { MenuItemProps } from './menuItem'
import SubMenu,{SubMenuProps} from './subMenu'
import {FC} from 'react'

// 一个已经声明好的类型，现在想再给他扩展一些类型 
// 在Ts里可以通过交叉类型来实现（不能像js那么通过属性来赋值
type MenuComponent = FC<MenuProps> & {
    Item:React.FC<MenuItemProps>
    SubMenu:React.FC<SubMenuProps>
}

// 类型断言来保证可以访问Menu.Item  但是这样是临时性的
// (Menu as MenuComponent).Item = MenuItem

// 方法二 直接将断言赋值给一个变量
const AllMenu = Menu as MenuComponent
AllMenu.Item = MenuItem 
AllMenu.SubMenu = SubMenu 

export default AllMenu