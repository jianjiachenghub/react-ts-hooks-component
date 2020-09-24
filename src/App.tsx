import React from "react";
//import Button from "./components/Button";
import Menu from "./components/Menu";
import Input from "./components/Input/input";
import AutoComplete from "./components/AutoComplete";
import "./styles/index.scss";
// 发布成功了
import { Button } from "react-ts-hooks";

function App() {
  let Do = () => {
    console.log(123);
    console.log(123);
  };

  return (
    <div className="App">
      <Menu
        onSelect={(index) => {
          console.log(index);
        }}
      >
        <Menu.Item>1111</Menu.Item>
        <Menu.Item disabled>2222</Menu.Item>
        <Menu.Item>3333</Menu.Item>
        <Menu.SubMenu title={"123"}>
          <Menu.Item>111</Menu.Item>
          <Menu.Item>3322233</Menu.Item>
        </Menu.SubMenu>
      </Menu>
      <Menu mode="vertical" defaultOpenSubMenus={["3"]}>
        <Menu.Item>1111</Menu.Item>
        <Menu.Item disabled>2222</Menu.Item>
        <Menu.Item>3333</Menu.Item>
        <Menu.SubMenu title={"123"}>
          <Menu.Item>111</Menu.Item>
          <Menu.Item>3322233</Menu.Item>
        </Menu.SubMenu>
      </Menu>
      <Button disabled>Hello</Button>
      <Button btnType="primary" size="lg" onClick={Do}>
        HHHH{" "}
      </Button>
      <Button btnType="link" size="lg" href="www">
        HHHH{" "}
      </Button>
      <Input style={{ width: "300px" }} placeholder="disabled input" disabled />
      <Input
        style={{ width: "300px" }}
        defaultValue="prepend text"
        prepend="https://"
      />
      <AutoComplete/>
    </div>
  );
}

export default App;
