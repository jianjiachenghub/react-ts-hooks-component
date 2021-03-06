import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import Hooks from './Hooks';
import VirtualList from './virtualList'
import * as serviceWorker from './serviceWorker';


ReactDOM.render(
  
    <VirtualList/>
    ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


/* // 发布*/
// export { default as Button } from './components/Button'
// export { default as Menu } from './components/Menu' 
// export { default as AutoComplete } from './components/AutoComplete' 
// export { default as Icon } from './components/Icon' 
// export { default as Input } from './components/Input/input' 
// export { default as Transition } from './components/Transition' 