import React from "react";
import Menu from "./index";
import { MenuProps } from "./menu";
import { render, RenderResult,fireEvent,wait } from "@testing-library/react";

const createStyleFile = () => {
    const cssFile: string = `
      .viking-submenu {
        display: none;
      }
      .viking-submenu.menu-opened {
        display:block;
      }
    `
    const style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = cssFile
    return style
  }

const generateMenu = (props: MenuProps) => {
  return (
    <Menu {...props}>
      <Menu.Item>active</Menu.Item>
      <Menu.Item disabled>disabled</Menu.Item>
      <Menu.Item>no active</Menu.Item>
      <Menu.SubMenu title={"dropdown"}>
          <Menu.Item>111</Menu.Item>
          <Menu.Item>3322233</Menu.Item>
        </Menu.SubMenu>
    </Menu>
  );
};

const testProps: MenuProps = {
  defaultIndex: "0",
  onSelect: jest.fn(),
  className: "test",
};

let menuElement: HTMLElement,
  wrapper: RenderResult,
  activeElement: HTMLElement,
  disabledElement: HTMLElement;
describe("Test Menu Base", () => {
  // 通用函数 创建每个测试it里都可能需要的变量
  beforeEach(() => {
    wrapper = render(generateMenu(testProps));
    wrapper.container.append(createStyleFile())
    menuElement = wrapper.getByTestId("Menu-test-id");
    activeElement = wrapper.getByText("active");
    disabledElement = wrapper.getByText("disabled");
  });

  it("if render", () => {
    expect(menuElement).toBeInTheDocument();
    expect(menuElement).toHaveClass("viking-menu");
    expect(menuElement.querySelectorAll(".viking-menu>li").length).toEqual(4);
    // :scope选择的是menuElement自身
    expect(menuElement.querySelectorAll(":scope > li").length).toEqual(4);
    expect(activeElement).toHaveClass('menu-item is-active')
    expect(disabledElement).toHaveClass('menu-item is-disabled')
  });

  it("do active",()=>{
    expect(menuElement).toBeInTheDocument();
    let noActive = wrapper.getByText("no active");
    expect(noActive).toBeInTheDocument();
    expect(noActive).not.toHaveClass('menu-item is-active')
    // 触发点击事件
    fireEvent.click(noActive)
    expect(noActive).toHaveClass('menu-item is-active')
    expect(activeElement).not.toHaveClass('menu-item is-active')
  })

  it(' call the right callback', () => {
    const firstItem = wrapper.getByText('active')
    fireEvent.click(firstItem)
    expect(firstItem).toHaveClass('is-active')
    expect(testProps.onSelect).toHaveBeenCalledWith('0')
    fireEvent.click(disabledElement)
    expect(disabledElement).not.toHaveClass('is-active')
    expect(testProps.onSelect).not.toHaveBeenCalledWith('1')
  })
  it('show dropdown items', async () => {
    expect(wrapper.queryByText('111')).not.toBeVisible()
    const dropdownElement = wrapper.getByText('dropdown')
    fireEvent.mouseEnter(dropdownElement)
    await wait(() => {
      expect(wrapper.queryByText('111')).toBeVisible()
    })
    fireEvent.click(wrapper.getByText('111'))
    expect(testProps.onSelect).toHaveBeenCalledWith('3-0')
    fireEvent.mouseLeave(dropdownElement)
    await wait(() => {
      expect(wrapper.queryByText('111')).not.toBeVisible()
    })
  })
});
