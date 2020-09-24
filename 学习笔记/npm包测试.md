## npm 模块开发问题

应用开发中，我们不可避免的需要使用或拆分为 npm 模块，经常遇到的一个问题是：新开发或修改的 npm 模块，如何在项目中试验？

## npm link 软连接

发布一个 npm 包，然后本地又在继续开发新的功能，以前的做法是需要发布到 npm，然后重新下载新的版本，然后进行测试。

但是可以使用 link 来解决这个麻烦的问题。npm link 可以使我们项目直接使用本地的依赖。

## 两个项目在一个文件夹里

```
$ cd /path/to/example
npm link ../module
```

## 两个项目不在一起

我们有两个项目：

- 一个是 npm-link-module，是我们要开发的 npm 模块
- 另一个是 npm-link-example,是我们要运行 npm 模块的项目

### Step1

首先，进入我们的 npm-link-module 项目，执行 npm link

```Shell
cd npm-link-module
npm link
```

执行命令后，npm-link-module 会根据 package.json 上的配置，被链接到全局，路径是全局文件夹{prefix}/lib/node_modules/\<package\>

### Step2

然后，进入 npm-link-example 项目，执行 npm link npm-link-module

```shell
cd npm-link-example
npm link npm-link-module
```

npm-link-module 会被链接到 npm-link-example/node_modules 下面。

### 分析

正在开发的项目 npm-link-module 被挂载到全局 node_modules,然后使用模块的 example 去连接全局的 npm-link-module，全局起到一个中转的作用。

```
moduleA -> global = global.moduleA 存在

example -> moduleA(global.moduleA) = example 指向了 moduleA
```

在 npm-link-example 里取 require 的模块。所有对 npm-link-module 的修改会被直接映射到 npm-link-example/node_modules/npm-link-module 下面.

## 入口文件

经过上面的链接到开发的module里时，在package里声明一下从哪里进入
```
  "main": "dist/index.js",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
```

## 解除link

解除项目和模块link，项目目录下，npm unlink 模块名

解除模块全局link，模块目录下，npm unlink 模块名

## 问题

可能遇到的问题
```
There are three common reasons you might be seeing it:

You might have mismatching versions of React and React DOM.
You might be breaking the Rules of Hooks.
You might have more than one copy of React in the same app.
```
我们在使用包的时候，会发现包里有一个react版本，然后引用的项目里也要一个不一样的react的版本就冲突了。

解决办法：在module中去link我们example里面的react就不会有两个版本了。

```
// module里
npm link ../example/node_modules/react
```
这样module和example都是用的example里的react依赖

