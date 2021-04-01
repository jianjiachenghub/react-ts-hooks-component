## React 类型指南

- https://github.com/typescript-cheatsheets/react
- https://react-typescript-cheatsheet.netlify.app/docs/basic/setup // 重要
- https://fettblog.eu/typescript-react/getting-started/

## React 中常用类型

### Function Components

返回正常的节点

```TSX
type AppProps = { message: string };
const App: React.FunctionComponent<AppProps> = ({ message }) => (
  <div>{message}</div>
);
const App: React.FC<AppProps> = ({ message }) => (
  <div>{message}</div>
);
```

### Hooks

#### useState

```TSX
const [user, setUser] = React.useState<IUser | null>(null);

// later...
setUser(newUser);
```

#### useReducer

```TSX
const initialState = { count: 0 };

type ACTIONTYPE =
  | { type: "increment"; payload: number }
  | { type: "decrement"; payload: string };

function reducer(state: typeof initialState, action: ACTIONTYPE) {
  switch (action.type) {
    case "increment":
      return { count: state.count + action.payload };
    case "decrement":
      return { count: state.count - Number(action.payload) };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "decrement", payload: "5" })}>
        -
      </button>
      <button onClick={() => dispatch({ type: "increment", payload: 5 })}>
        +
      </button>
    </>
  );
}
```

#### useRef

```
const ref1 = useRef<HTMLElement>(null!); // null!是非空断言
const ref2 = useRef<HTMLElement | null>(null);
```

HTMLElement 有很多具体的类型：

可以去react目录下的global.d,ts下面去查看
```TS
interface HTMLElement extends Element { }
interface HTMLAnchorElement extends HTMLElement { }
interface HTMLAreaElement extends HTMLElement { }
interface HTMLAudioElement extends HTMLElement { }
interface HTMLBaseElement extends HTMLElement { }
interface HTMLBodyElement extends HTMLElement { }
interface HTMLBRElement extends HTMLElement { }
interface HTMLButtonElement extends HTMLElement { }
interface HTMLCanvasElement extends HTMLElement { }
interface HTMLDataElement extends HTMLElement { }
interface HTMLDataListElement extends HTMLElement { }
interface HTMLDialogElement extends HTMLElement { }
interface HTMLDivElement extends HTMLElement { }
interface HTMLDListElement extends HTMLElement { }
interface HTMLEmbedElement extends HTMLElement { }
interface HTMLFieldSetElement extends HTMLElement { }
interface HTMLFormElement extends HTMLElement { }
interface HTMLHeadingElement extends HTMLElement { }
interface HTMLHeadElement extends HTMLElement { }
interface HTMLHRElement extends HTMLElement { }
interface HTMLHtmlElement extends HTMLElement { }
interface HTMLIFrameElement extends HTMLElement { }
interface HTMLImageElement extends HTMLElement { }
interface HTMLInputElement extends HTMLElement { }
interface HTMLModElement extends HTMLElement { }
interface HTMLLabelElement extends HTMLElement { }
interface HTMLLegendElement extends HTMLElement { }
interface HTMLLIElement extends HTMLElement { }
interface HTMLLinkElement extends HTMLElement { }
interface HTMLMapElement extends HTMLElement { }
interface HTMLMetaElement extends HTMLElement { }
interface HTMLObjectElement extends HTMLElement { }
interface HTMLOListElement extends HTMLElement { }
interface HTMLOptGroupElement extends HTMLElement { }
interface HTMLOptionElement extends HTMLElement { }
interface HTMLParagraphElement extends HTMLElement { }
interface HTMLParamElement extends HTMLElement { }
interface HTMLPreElement extends HTMLElement { }
interface HTMLProgressElement extends HTMLElement { }
interface HTMLQuoteElement extends HTMLElement { }
interface HTMLSlotElement extends HTMLElement { }
interface HTMLScriptElement extends HTMLElement { }
interface HTMLSelectElement extends HTMLElement { }
interface HTMLSourceElement extends HTMLElement { }
interface HTMLSpanElement extends HTMLElement { }
interface HTMLStyleElement extends HTMLElement { }
interface HTMLTableElement extends HTMLElement { }
interface HTMLTableColElement extends HTMLElement { }
interface HTMLTableDataCellElement extends HTMLElement { }
interface HTMLTableHeaderCellElement extends HTMLElement { }
interface HTMLTableRowElement extends HTMLElement { }
interface HTMLTableSectionElement extends HTMLElement { }
interface HTMLTemplateElement extends HTMLElement { }
interface HTMLTextAreaElement extends HTMLElement { }
interface HTMLTitleElement extends HTMLElement { }
interface HTMLTrackElement extends HTMLElement { }
interface HTMLUListElement extends HTMLElement { }
interface HTMLVideoElement extends HTMLElement { }
interface HTMLWebViewElement extends HTMLElement { }
```

### Class Components

```TSX
type MyProps = {
  // using `interface` is also ok
  message: string;
};
type MyState = {
  count: number; // like this
};
class App extends React.Component<MyProps, MyState> {
  state: MyState = {
    // optional second annotation for better type inference
    count: 0,
  };
  render() {
    return (
      <div>
        {this.props.message} {this.state.count}
      </div>
    );
  }
}
```

## Forms and Events

```TSX
// typing on RIGHT hand side of =
  onChange = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({ text: e.currentTarget.value });
  };

   // typing on LEFT hand side of =
  onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    this.setState({text: e.currentTarget.value})
  }
    //Typing onSubmit, with Uncontrolled components in a Form
  onSubmit={(e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value; // typechecks!
    const password = target.password.value; // typechecks!
    // etc...
  }}
```

### Event 事件对象类型

```
ClipboardEvent<T = Element> 剪切板事件对象

DragEvent<T =Element> 拖拽事件对象

ChangeEvent<T = Element> Change事件对象

KeyboardEvent<T = Element> 键盘事件对象

MouseEvent<T = Element> 鼠标事件对象

TouchEvent<T = Element> 触摸事件对象

WheelEvent<T = Element> 滚轮时间对象

AnimationEvent<T = Element> 动画事件对象

TransitionEvent<T = Element> 过渡事件对象
```

### 事件处理函数类型

当我们定义事件处理函数时有没有更方便定义其函数类型的方式呢？答案是使用 React 声明文件所提供的 EventHandler 类型别名，通过不同事件的 EventHandler 的类型别名来定义事件处理函数的类型。

EventHandler 接收 E ，其代表事件处理函数中 event 对象的类型。
```
    type EventHandler<E extends SyntheticEvent<any>> = { bivarianceHack(event: E): void }["bivarianceHack"];
    type ReactEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
    type ClipboardEventHandler<T = Element> = EventHandler<ClipboardEvent<T>>;
    type DragEventHandler<T = Element> = EventHandler<DragEvent<T>>;
    type FocusEventHandler<T = Element> = EventHandler<FocusEvent<T>>;
    type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>;
    type ChangeEventHandler<T = Element> = EventHandler<ChangeEvent<T>>;
    type KeyboardEventHandler<T = Element> = EventHandler<KeyboardEvent<T>>;
    type MouseEventHandler<T = Element> = EventHandler<MouseEvent<T>>;
    type TouchEventHandler<T = Element> = EventHandler<TouchEvent<T>>;
    type PointerEventHandler<T = Element> = EventHandler<PointerEvent<T>>;
    type UIEventHandler<T = Element> = EventHandler<UIEvent<T>>;
    type WheelEventHandler<T = Element> = EventHandler<WheelEvent<T>>;
    type AnimationEventHandler<T = Element> = EventHandler<AnimationEvent<T>>;
    type TransitionEventHandler<T = Element> = EventHandler<TransitionEvent<T>>;
```

### 合成事件包装器 SyntheticEvent

`SyntheticEvent<T = Element, E = Event>`泛型接口,即原生事件的集合，就是原生事件的组合体.您的事件处理程序将传递 SyntheticEvent 的实例，这是一个跨浏览器原生事件包装器。(官方介绍)

```
  <button onClick={(e:SyntheticEvent<Element, Event>)=>{

  }}></button>
  <input onChange={(e:SyntheticEvent<Element, Event>)=>{

  }}/>
  <form
      onSubmit={(e: SyntheticEvent<Element, Event>) => {

      }}
      onBlur={(e: SyntheticEvent<Element, Event>) => {

      }}
      onKeyUp={(e: SyntheticEvent<Element, Event>) => {

      }}
  >
  </form>
  //...

```

## Context

```JSX
import * as React from "react";

interface AppContextInterface {
  name: string;
  author: string;
  url: string;
}

const AppCtx = React.createContext<AppContextInterface | null>(null);

// Provider in your app

const sampleAppContext: AppContextInterface = {
  name: "Using React Context in a Typescript App",
  author: "thehappybug",
  url: "http://www.example.com",
};

export const App = () => (
  <AppCtx.Provider value={sampleAppContext}>...</AppCtx.Provider>
);

// Consume in your app

export const PostInfo = () => {
  const appContext = React.useContext(AppCtx);
  return (
    <div>
      Name: {appContext.name}, Author: {appContext.author}, Url:{" "}
      {appContext.url}
    </div>
  );
};
```

## forwardRef/createRef

```JSX
class CssThemeProvider extends React.PureComponent<Props> {
  private rootRef = React.createRef<HTMLDivElement>(); // like this
  render() {
    return <div ref={this.rootRef}>{this.props.children}</div>;
  }
}
```

```JSX
type Props = { children: React.ReactNode; type: "submit" | "button" };
export type Ref = HTMLButtonElement;
export const FancyButton = React.forwardRef<Ref, Props>((props, ref) => (
  <button ref={ref} className="MyClassName" type={props.type}>
    {props.children}
  </button>
));
```

## Portals

```JSX
const modalRoot = document.getElementById("modal-root") as HTMLElement;
// assuming in your html file has a div with id 'modal-root';

export class Modal extends React.Component {
  el: HTMLElement = document.createElement("div");

  componentDidMount() {
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}
```

## Basic Prop Types Examples

```TSX
type AppProps = {
  message: string;
  count: number;
  disabled: boolean;
  /** array of a type! */
  names: string[];
  /** string literals to specify exact string values, with a union type to join them together */
  status: "waiting" | "success";
  /** any object as long as you dont use its properties (NOT COMMON but useful as placeholder) */
  obj: object;
  obj2: {}; // almost the same as `object`, exactly the same as `Object`
  /** an object with any number of properties (PREFERRED) */
  obj3: {
    id: string;
    title: string;
  };
  /** array of objects! (common) */
  objArr: {
    id: string;
    title: string;
  }[];
  /** a dict object with any number of properties of the same type */
  dict1: {
    [key: string]: MyTypeHere;
  };
  dict2: Record<string, MyTypeHere>; // equivalent to dict1
  /** any function as long as you don't invoke it (not recommended) */
  onSomething: Function;
  /** function that doesn't take or return anything (VERY COMMON) */
  onClick: () => void;
  /** function with named prop (VERY COMMON) */
  onChange: (id: number) => void;
  /** alternative function type syntax that takes an event (VERY COMMON) */
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  /** an optional prop (VERY COMMON!) */
  optional?: OptionalType;
};
```

## Useful React Prop Type Examples

一些React的内置类型

- React.ReactElement —— 使用React.createElement创建的，可以简单理解为React中的JSX的元素
- React.ReactNode —— `<div>xxx</div> `xxx的合法类型
- React.CSSProperties —— 组件内联的style对象的类型
- React.RefObject —— React.createRef创建的类型，只读不可改
- React.MutableRefObject —— useRef创建的类型，可以修改

```TSX
export declare interface AppProps {
  children1: JSX.Element; // bad, doesnt account for arrays
  children2: JSX.Element | JSX.Element[]; // meh, doesn't accept strings
  children3: React.ReactChildren; // despite the name, not at all an appropriate type; it is a utility
  children4: React.ReactChild[]; // better
  children: React.ReactNode; // best, accepts everything
  functionChildren: (name: string) => React.ReactNode; // recommended function as a child render prop type
  style?: React.CSSProperties; // to pass through style props
  onChange?: React.FormEventHandler<HTMLInputElement>; // form events! the generic parameter is the type of event.target
  props: Props & React.PropsWithoutRef<JSX.IntrinsicElements["button"]>; // to impersonate all the props of a button element without its ref
}
```

- JSX.Element -> Return value of React.createElement
- React.ReactNode -> Return value of a component

```
namespace JSX {
    // ...
    interface Element extends React.ReactElement<any, any> { }
    // ...
}
```

ReactElement 是一个接口，包含 type,props,key 三个属性值。该类型的变量值只能是两种： null 和 ReactElement 实例.

ReactNode 是一种联合类型(Union Types)，可以是 string、number、ReactElement、{}、boolean、ReactNodeArray。由此可以看出 ReactElement 类型的变量可以直接赋值给 ReactNode 类型的变量，但是反过来是不行的。

JSX.Element `extends` ReactElement ⊂ ReactNode

## Images and other non-TS/TSX files

```
// declaration.d.ts
// anywhere in your project, NOT the same name as any of your .ts/tsx files
declare module "*.png";

// importing in a tsx file
import * as logo from "./logo.png";
```

## HOC

高级的动态高阶组件示例，它的一些参数基于传入的组件的支柱

```
// inject static values to a component so that they're always provided
export function inject<TProps, TInjectedKeys extends keyof TProps>(
  Component: React.JSXElementConstructor<TProps>,
  injector: Pick<TProps, TInjectedKeys>
) {
  return function Injected(props: Omit<TProps, TInjectedKeys>) {
    return <Component {...(props as TProps)} {...injector} />;
  };
}

```
## 组件与原生属性混合

想封装一些button组件和input组件，会注入一些属性，然后原生的属性也要支持
```TS
type NativeButtonProps = ButtonHTMLAttributes<HTMLElement> & BaseButtonProps
type NativeAriaProps = AnchorHTMLAttributes<HTMLElement> & BaseButtonProps
```