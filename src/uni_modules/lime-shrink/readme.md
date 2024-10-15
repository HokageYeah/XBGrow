# lime-shrink 图片压缩
- 基于uniapp vue3 canvas 实现的图片压缩插件

### 安装
- 导入插件

### 使用

```html
<l-shrink ref="shrinkRef"></l-shrink>
```
```js
const shrinkRef = ref(null)
// 支持数组
// compressImage(file|file[], options:{quality: number})
// quality: 0-100之间，默认80
const res = await shrinkRef.value.compressImage('/static/logo.png');
// 批量
const res = await shrinkRef.value.compressImage(['/static/logo.png', '/static/logo1.png'], {quality: 75});
```


### 查看示例
- 导入后直接使用这个标签查看演示效果

```html
<!-- // 代码位于 uni_modules/lime-shrink/compoents/lime-shrink -->
<lime-shrink />
```


### 插件标签
- 默认 l-shrink 为 component
- 默认 lime-shrink 为 demo

### 关于vue2的使用方式
- 插件使用了`composition-api`, 如果你希望在vue2中使用请按官方的教程[vue-composition-api](https://uniapp.dcloud.net.cn/tutorial/vue-composition-api.html)配置
- 关键代码是: 在main.js中 在vue2部分加上这一段即可.

```js
// main.js vue2
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)
```
另外插件也用到了TS，vue2可能会遇过官方的TS版本过低的问题,找到HX目录下的`compile-typescript`目录
```cmd
// \HBuilderX\plugins\compile-typescript
yarn add typescript -D
- or - 
npm install typescript -D
```


## 打赏

如果你觉得本插件，解决了你的问题，赠人玫瑰，手留余香。  
![](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/alipay.png)
![](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/wpay.png)