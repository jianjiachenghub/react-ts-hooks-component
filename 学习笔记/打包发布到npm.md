## 打包出来的文件的入口

通过main来指定，但package.josn原来是服务于Node的，main默认按照CommentJS来，我们使用ESMoudle可以再填加一个module字段，这样到时候也可以使用treeSharking

```
{
  "name": "react-ts-hooks",
  "version": "0.1.0",
  "private": false,
  "author": "jcjian",
  "main": "dist/index.js",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
}
```

## Index.js

```
export { default as Button } from './components/Button'
export { default as Menu } from './components/Menu' 
```

这个文件被指定为入口文件后，所以我们所以组件都放到这里面进行中转即可。然后就可以从模块里获取到所有的组件

```
import {Menu} from 'my-ui';
```

## 组件库的打包编译 tsconfig.build.json配置

TSX-> ES6 modules jsx

```json
{
  "compilerOptions": {
    "outDir": "dist", // 输出到dist文件夹
    "module": "esnext", // es module import形式
    "target": "es5", // 编译成es5 更广浏览器支持
    "declaration": true, // 给每个TS文件成一个.d.ts声明文件
    "jsx": "react", // 用React.createElement来解析JSX
    "moduleResolution":"Node", // 默认是classic 从当前路径向上找 找不到 需要从node_modules里找
    "allowSyntheticDefaultImports": true, // 支持default 导出
  },
  "include": [
    "src" // 只编译src
  ],
  "exclude": [ // 排除一些不需要编译的
    "src/**/*.test.tsx",
    "src/**/*.stories.tsx",
    "src/setupTests.ts",
  ]
}
```

## 为什么不采用webpack打包构建

不推荐使用以构建的文件来发布包，这样无法进行按需加载，而且难以获取底层依赖模块的bug。

不能按需加载包的大小会很大，一个库很多个模块，你也许只有一两个，所以很浪费。
并且本来的ESmoudle还能进行treeSharking还能进行进一步优化。这样在你的项目打包时能大大减小大小。

## 指定发布的文件夹


```json
  "files": [
    "dist"
  ],
```

## npm 信息

首先确保metrics-registry没有使用其他代理
```bash
PS D:\gitReactProject\react-ts-hooks> npm config ls
; cli configs
metrics-registry = "https://registry.npmjs.org/"
scope = ""
user-agent = "npm/6.12.0 node/v12.13.0 win32 x64"

; builtin config undefined
prefix = "C:\\Users\\简佳成\\AppData\\Roaming\\npm"

; node bin location = C:\Program Files\nodejs\node.exe
; cwd = D:\gitReactProject\react-ts-hooks
; HOME = C:\Users\简佳成
; "npm config ls -l" to show all defaults.

PS D:\gitReactProject\react-ts-hooks>
```

然后可以登录npm账号

npm whoami 可以查询是否登录
npm adduser 开始登录