## 项目运行

1. 克隆项目后，先下载项目依赖，执行命令 `npm install`。建议 node 版本 18+
2. 运行到微信小程序：npm run dev:mp-weixin。 其余平台运行命令查看package.json文件夹下的，scripts
3. 运行到 H5：npm run dev:h5。【注意】本地访问时需要使用 .xxt.cn 二级域名访问
4. 如果项目下载后submodelue配置有误，导致项目子模块无法下载，或者运行`git submodule init` || `git submodule update --init` 后仍然无法下载子模块，则可以先运行 `npm run init:submodule`，再运行 `npm run dev:h5`。注意⚠️：`npm run init:submodule`此命令每次运行都会重新生成新的.git目录，git远程仓库地址会被重置，需要重新添加，请保证在项目初始化的时候才执行一次。

###

## vite插件说明
* "pinia-plugin-persist-uni": 这个库是一个用于持久化存储Pinia状态的插件。它可以帮助你在浏览器的本地存储（如localStorage）中保存Pinia状态，并在页面刷新或重新加载后自动恢复这些状态。这对于需要在应用程序会话之间保持状态的场景非常有用。

* "pinia-auto-refs": 这个库是Pinia的一个插件，用于自动创建和引用store实例的全局变量。通常情况下，你需要在Vue组件中手动导入和使用store实例，而"pinia-auto-refs"可以简化这个过程。它会自动将store实例绑定到Vue实例的$store属性上，从而使你可以在组件中直接访问和使用store实例，而无需手动导入。

* "unocss": Unocss 是一个基于类似于 Tailwind CSS 的概念的工具，它可以自动提取和生成优化的 CSS 样式，以减少样式文件的大小和冗余。CSS原子化，最好用于vite webpack属于阉割版功能很少。"unocss": "0.50.4", 配置太高会产生微信端不兼容的问题。

* "unplugin-auto-import": 是一个为 Vite、Webpack、Rollup 和 esbuild 按需自动导入 API，支持 TypeScript的插件，我们基于此插件实现自动按需导入。

* "stylelint": 是一个用于检测和报告 CSS 或类似语法的工具，它帮助开发者维护一致的代码风格和规范。它可以帮助你捕获并修复潜在的错误、避免常见的代码问题，并通过强制执行规则来确保团队成员之间的一致性。

* "postcss-px2rpx": 是一个用于将 CSS 中的像素单位（px）转换为小程序 rpx 单位的 PostCSS 插件。vite环境内置postcss，在css配置项中配置postcss环境，以及相关插件。

## 配置说明
```shell
'<script setup lang=ts>' should be above '<template>' on line 1.eslintvue/component-tags-order 报错说明：
```
这个错误是由 eslint-plugin-vue 的规则 vue/component-tags-order 引起的。它要求在 Vue 单文件组件中。
```shell
  <script setup> 标签应该位于 <template> 标签之前。可以在eslint配置文件规则中添加"vue/component-tags-order": "off" 关闭此错误。
```

## 项目说明
> `uni-app + vue3.x` 项目工程化搭建，集成 `ESLint`、`Prettier`、`Stylelint`、`husky`、`lint-staged` 、`commitlint`等，同时实现了 pinia 在 uniapp 中的持久化插件


  1、项目符合easycom规范：
  * 传统vue组件，需要安装、引用、注册，三个步骤后才能使用组件。easycom将其精简为一步。
  * 安装在项目根目录的components目录下，并符合components/组件名称/组件名称.vue
  * 安装在uni_modules下，路径为uni_modules/插件ID/components/组件名称/组件名称.vue

  2、路由使用：vue3简洁路由库uni-mini-router
  * [uni-mini-router文档](https://moonofweisheng.github.io/uni-mini-router/guide/quick-use.html)
  * 注意：这里name 和 params搭配使用，而path 可以与 query 一起使用。

  3、unplugin-auto-import（配置自动按需导入）
  * unplugin-auto-import：是一个为 Vite、Webpack、Rollup 和 esbuild 按需自动导入 API，支持 TypeScript的插件，我们基于此插件实现自动按需导入。
  * 不使用按需导入，则需要手动import
  ```shell
  import { useRouter } from 'uni-mini-router'
  const router = useRouter()
  router.push('/')
  ```
  * 使用按需导入后:
  ```shell
  const router = useRouter()
  router.push('/')
  ```

  4、pinia导入的三种方式（具体使用在pages/detail/index.vue文件中）。
  * 方式一：
      使用传统的import导入，usestore创建。
      例如：
      ```shell
      import testStore from '@/uni-module-common/store/modules/test';
      const teststor = testStore();
      teststor.increment();
      ```

  * 方式二：
      使用函数的方式导入、创建。
      例如：
      ```shell
      import $store from '@/uni-module-common/store/index';
      const test = $store('test');
      test.increment();
      ```
  * 方式三：（推荐）
    使用自动导入（无需手动导入）创建的方式。
    例如：
    ```shell
    const { count, increment } = useStore('test');
    increment();
    ```

  5、 使用"pinia-auto-refs"插件自动导入store文件夹下面的状态管理文件，必须使用扁平化的文件创建模式，插件内置逻辑，store内部不在适合建立文件夹。将建立的管理状态文件都建立在store文件夹下。运行成功后回在commons文件夹下生成helper/pinia-auto-refs.ts文件，此文件是自动导入的主要代码。

  6、在vite.config.ts中使用loadEnv这个vite方法，实现在vite配置文件中读取环境变量。

  7、小程序端图片支持两种：①、base64。②、网络图片。

  8、uni.scss uni-app内置的常用样式变量、全局样式配置。

  9、网络请求使用第三方插件uni-ajax。然后对其进行封装，支持全平台。
   * [uni-ajax文档](https://uniajax.ponjs.com/guide/)

## 所用技术栈

- 小程序框架： [uni-app](https://uniapp.dcloud.io/)
- 构建工具： [Vite](https://vitejs.dev/)
- 前端框架： [Vue3.x](https://v3.cn.vuejs.org/)
- 编程语言： [TypeScript](https://www.typescriptlang.org/)
- 代码规范：
  - [ESLint](https://eslint.org/)
  - [ESLint 开始，说透我如何在团队项目中基于 Vue 做代码校验](https://juejin.cn/post/6974223481181306888#heading-26)
  - [Prettier](https://prettier.io/)
  - [Stylelint](https://stylelint.io/)
- 提交规范：
  - [husky](https://typicode.github.io/husky/#/)
  - [lint-staged](https://www.npmjs.com/package/lint-staged)
  - [commitlint](https://commitlint.js.org/#/)
- css 预处理器： [scss](https://sass-lang.com/)
- 状态管理工具：[pinia](https://pinia.vuejs.org/)
- pinia 数据持久化插件：[pinia-plugin-persist-uni](https://allen-1998.github.io/pinia-plugin-persist-uni/)
- router路由管理： [uni-mini-router文档](https://moonofweisheng.github.io/uni-mini-router/guide/quick-use.html)
- http网络请求管理：[uni-ajaxr文档](https://uniajax.ponjs.com/guide/)
- vite 插件：
  - [pinia-auto-refs](https://github.com/Allen-1998/pinia-auto-refs)
  - [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import)
  - [auto-import-types](https://github.com/Allen-1998/auto-import-types)
  - [unocss](https://github.com/unocss/unocss)

## 工程目录
```script
.
├── .husky
│   ├── _
│   ├── pre-commit commit前置钩子
├── .vscode
│   ├── extensions.json vscode工作区插件推荐
│   ├── settings.json vscode工作区设置
├── build  打包构建配置
│   └──vite vite开发生产环境配置、代理配置
├── src
│   ├── @types ts类型定义
│   └── commons 公共包
│       ├── config 全局配置
│       ├── @helper storeToRefs 增强(pinia-auto-refs自动生成)
│       ├── hooks hooks函数
│       ├── http 请求中心
│       ├── router 路由跳转封装
│       ├── store 状态管理
│       └── utils 工具包
│   ├── components 项目组件
│   ├── pages 页面目录
│   ├── static 静态资源、css
│   ├── style 全局样式
│   ├── App.vue 入口文件
│   ├── auto-imports.d.ts 自动导入vue-composition-api(unplugin-auto-import自动生成)
│   ├── env.d.ts 全局声明
│   ├── main.ts 主入口
│   ├── manifest.json 应用配置文件
│   ├── pages.json 全局配置文件
│   └── uni.scss uni-app内置的常用样式变量、全局样式配置
├── .editorconfig 编辑器配置
├── .env.development 开发的环境变量
├── .env.production 生产的环境变量
├── .eslintignore eslint忽略配置
├── .eslintrc-auto-import-types.json 自动挂载@types下.d.ts文件定义的类型到global(auto-import-types自动生成)
├── .eslintrc-auto-import.json 自动挂载 unplugin-auto-import 的类型到global(unplugin-auto-import自动生成)
├── .eslintrc.js eslint配置
├── .gitignore git忽略配置
├── .lintstagedrc.json lint-staged配置
├── .npmrc npm配置
├── .prettierignore prettier忽略配置
├── .stylelintignore stylelint忽略配置
├── .stylelintrc.js stylelint配置
├── 更改规范注意点.md
├── index.html 项目入口
├── package-lock.json
├── package.json
├── prettier.config.js prettier配置
├── README.md
├── shims-uni.d.ts
├── tsconfig.json ts配置
├── unocss.config.ts unocss配置
└── vite.config.ts vite配置
```
