# uni-module-public

## 项目说明
1. 此项目是公共业务模块项目，包括公共登录、公共的活动等模块都放在此项目中。
2. 此项目是需要进行代码分包，保证在微信小程序端能够不影响主包大小。

## 文件说明
1. public.json
   * 是进行分包的配置，内部的subPackages模块是最后执行脚本后写入项目工程pages.json中的的子模块分包subPackages的配置。
   * mainPath中需要写名工程pages.json文件的相对目录。
   * copyMainPath 是需要拷贝的文件地址，如果没有的话脚本会自动创建。
   * envDevelopmentPath 是项目中.env.development 的路径， 脚本中会读取此配置文件中的VITE_LOGIN_WX_APP_CONFIG配置，并把从中读取到的subPackagesRoot值放在拷贝pages-copy.json文件中的subPackages.root选项中。（子报路径，从配置文件中获取）
   * 项目中VITE_LOGIN_WX_APP_CONFIG内容，是整个项目的配置，会有其余不同项目的个性化配置。
2. publicPackages.js
   * 此脚本文件在每次编写完公共模块代码且public.json配置完成后要执行，它会把配置的subPackages信息自动添加到pages-copy.json中。
   * > 注意：脚本无法处理json中带有注释的文件，在运行完后会讲注释全都删除掉。所以此脚本会创建一个pages-copy.json文件，并把pages.json中的配置去掉注释写入其中，并且自动合并public.json中subPackages的配置。在合并完成后自己需要手动从pages-copy.json文件拷贝需要的内容放入真正的配置文件pages.json中去。
