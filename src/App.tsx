import React from "react";
import Button from "./components/Button";
import Menu from "./components/Menu";
import "./styles/index.scss";

function App() {
  let Do = () => {
    console.log(123);
    console.log(123);
  };

  return (
    <div className="App">
      <Menu onSelect={(index)=>{
        console.log(index)
      }}>
        <Menu.Item>1111</Menu.Item>
        <Menu.Item disabled>2222</Menu.Item>
        <Menu.Item>3333</Menu.Item>
        <Menu.SubMenu title={"123"}>
          <Menu.Item>111</Menu.Item>
          <Menu.Item>3322233</Menu.Item>
        </Menu.SubMenu>
      </Menu>
      <Menu mode="vertical" defaultOpenSubMenus={['3']}>
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
    </div>
  );
}

export default App;
