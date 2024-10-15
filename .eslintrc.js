// module.exports = {
//   root: true,
//   parserOptions: {
//     // parser: 'babel-eslint',
//     // parser: '@babel/eslint-parser',
//     sourceType: 'module',
//   },
//   env: {
//     browser: true,
//     node: true,
//     es6: true,
//   },
//   // plugins: ["prettier"],
//   parser: '@typescript-eslint/parser',
//   plugins: ['@typescript-eslint'],
//   extends: [
//     // 'plugin:vue/essential',
//     'eslint:recommended',
//     'plugin:@typescript-eslint/recommended',
//     'plugin:vue/recommended',
//     'airbnb-base',
//     // 'airbnb',
//     // 'eslint:recommended',
//     // 'plugin:prettier/recommended',
//   ],
//   // add your custom rules here
//   // it is base on https://github.com/vuejs/eslint-config-vue
//   /**
//    * "off" 或 0 - 关闭规则
//    * "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出),
//    * "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
//    */
//   rules: {
//     'no-alert': 'off',
//     'no-console': 'off',
//     camelcase: 'off',
//     'import/order': 'off', // 忽略 import/order 错误
//     'vue/no-mutating-props': 'off',
//     'no-unused-expressions': 'off',
//     'prefer-destructuring': 'off',
//     'no-nested-ternary': 'off',
//     'no-param-reassign': 'off',
//     'vue/multi-word-component-names': 'off', // 忽略组件的命名应该是多个单词组合而成
//     indent: ['error', 2],
//     // // "prettier/prettier": 2,
//     // "max-len": [2, {
//     //   "code": 120 //（默认为 80）规定了一个最大行长。这个规则需要和 .prettier.config.js 中保持一致
//     // }],
//     // "vue/max-attributes-per-line": [2, {
//     //   "singleline": 5, // 单行时允许的属性最大个数。默认值：1
//     //   "multiline": {
//     //     "max": 1,  // 多行时允许的属性最大个数
//     //     "allowFirstLine": false  // 多行时第一行是否允许存在属性
//     //   }
//     // }],
//     // "vue/singleline-html-element-content-newline": "off",
//     // "vue/multiline-html-element-content-newline":"off",
//     // "vue/name-property-casing": ["error", "PascalCase"],
//     // "vue/no-v-html": "off",
//     // 'accessor-pairs': 2, // 定义对象的set存取器属性时，强制定义get
//     // 'arrow-spacing': [2, {
//     //   'before': true,
//     //   'after': true
//     // }],
//     // 'block-spacing': [2, 'always'], // 禁止或强制在单行代码块中使用空格
//     // 'brace-style': [2, '1tbs', {
//     //   'allowSingleLine': true
//     // }], // 强制使用一致的缩进
//     // 'camelcase': [0, {
//     //   'properties': 'always'
//     // }], // 双峰驼命名格式
//     // 'comma-dangle': [2, 'always-multiline'],
//     // 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号，always-multiline：多行模式必须带逗号，单行模式不能带逗号
//     // 'comma-spacing': [2, {
//     //   'before': false,
//     //   'after': true
//     // }], // 控制逗号前后的空格
//     // 'comma-style': [2, 'last'], // 控制逗号在行尾出现还是在行首出现 (默认行尾)
//     // 'constructor-super': 2, // 强制在子类构造函数中用super()调用父类构造函数，TypeScrip的编译器也会提示
//     // 'curly': [2, 'multi-line'], // 强制所有控制语句使用一致的括号风格
//     // 强制object.key 中 . 的位置，property：'.'号应与属性在同一行；object：'.' 号应与对象名在同一行
//     // 'dot-location': [2, 'property'],
//     // 'eol-last': 2, // 文件末尾强制换行
//     // 'eqeqeq': [2, "always", {"null": "ignore"}], // 使用 === 替代 ==
//     // 'generator-star-spacing': [2, {
//     //   'before': true,
//     //   'after': true
//     // }], // 强制 generator 函数中 * 号周围使用一致的空格
//     // 'handle-callback-err': [2, '^(err|error)$'], // 要求回调函数中有容错处理
//     // 'indent': [2, 2, {
//     //   'SwitchCase': 1
//     // }],
//     // 'jsx-quotes': [2, 'prefer-single'], // 强制在 JSX 属性中一致地使用双引号或单引号
//     // 'key-spacing': [2, {
//     //   'beforeColon': false,
//     //   'afterColon': true
//     // }], // 强制在对象字面量的属性中键和值之间使用一致的间距
//     // 'keyword-spacing': [2, {
//     //   'before': true,
//     //   'after': true
//     // }],
//     // 'new-cap': [2, {
//     //   'newIsCap': true,
//     //   'capIsNew': false
//     // }], // 要求构造函数首字母大写 （要求调用 new 操作符时有首字母大小的函数，允许调用首字母大写的函数时没有 new 操作符。）
//     // 'new-parens': 2, // 要求调用无参构造函数时有圆括号
//     // 'no-array-constructor': 2, // 禁止使用 Array 构造函数
//     // 'no-caller': 2, // 禁用 arguments.caller 或 arguments.callee
//     // 'no-console': 0, // 禁用 console
//     // 'no-class-assign': 2, // 禁止修改类声明的变量
//     // 'no-cond-assign': 2, // 禁止条件表达式中出现赋值操作符
//     // 'no-const-assign': 2, //禁止修改 const 声明的变量
//     // 'no-control-regex': 0, // 禁止在正则表达式中使用控制字符 ：new RegExp("\x1f")
//     // 'no-delete-var': 2, // 禁止删除变量
//     // 'no-dupe-args': 2, // 禁止 function 定义中出现重名参数
//     // 'no-dupe-class-members': 2, // 禁止类成员中出现重复的名称
//     // 'no-dupe-keys': 2, // 禁止对象字面量中出现重复的 key
//     // 'no-duplicate-case': 2, // 禁止重复的 case 标签
//     // 'no-empty-character-class': 2, // 禁止在正则表达式中使用空字符集 (/^abc[]/)
//     // 'no-empty-pattern': 2, // 禁止使用空解构模式
//     // 'no-eval': 2, // 禁用 eval()
//     // 'no-ex-assign': 2, // 禁止对 catch 子句的参数重新赋值
//     // 'no-extend-native': 2, // 禁止扩展原生类型
//     // 'no-extra-bind': 2, // 禁止不必要的 .bind() 调用
//     // 'no-extra-boolean-cast': 2, // 禁止不必要的布尔转换
//     // 'no-extra-parens': [2, 'functions'], // 禁止不必要的括号 -- (a * b) + c;//报错
//     // 'no-fallthrough': 2, // 禁止 case 语句落空
//     // 'no-floating-decimal': 2, // 禁止数字字面量中使用前导和末尾小数点
//     // 'no-func-assign': 2, // 禁止对 function 声明重新赋值
//     // 'no-implied-eval': 2, // 禁止使用类似 eval() 的方法
//     // 'no-inner-declarations': [2, 'functions'],
//     // 'no-invalid-regexp': 2, // 禁止 RegExp 构造函数中无效的正则表达式字符串
//     // 'no-irregular-whitespace': 2, // 禁止在字符串和注释之外不规则的空白
//     // 'no-iterator': 2, // 禁用 __iterator__ 属性
//     // 'no-label-var': 2, // 不允许标签与变量同名
//     // 'no-labels': [2, {
//     //   'allowLoop': false,
//     //   'allowSwitch': false
//     // }], // 禁用标签语句
//     // 'no-lone-blocks': 2, // 禁用不必要的嵌套块
//     // 'no-mixed-spaces-and-tabs': 2, // 不允许空格和 tab 混合缩进
//     // 'no-multi-spaces': 2, // 禁止使用多个空格
//     // 'no-multi-str': 2, // 禁止使用多行字符串，在 JavaScript 中，可以在新行之前使用斜线创建多行字符串
//     // 'no-multiple-empty-lines': [2, {
//     //   'max': 1
//     // }], // 不允许多个空行
//     // 'no-native-reassign': 2, // 禁止对原生对象赋值
//     // 'no-negated-in-lhs': 2, // 禁止在 in 表达式中出现否定的左操作数
//     // 'no-new-object': 2, // 禁止使用 Object 的构造函数
//     // 'no-new-require': 2, // 禁止调用 require 时使用 new 操作符
//     // 'no-new-symbol': 2, // 禁止 Symbol 的构造函数
//     // 'no-new-wrappers': 2, // 禁止对 String，Number 和 Boolean 使用 new 操作符
//     // 'no-obj-calls': 2, // 禁止把全局对象 (Math 和 JSON) 作为函数调用 错误：var math = Math();
//     // 'no-octal': 2, // 禁用八进制字面量
//     // 'no-octal-escape': 2, // 禁止在字符串中使用八进制转义序列
//     // 'no-path-concat': 2, // 禁止对 __dirname 和 __filename进行字符串连接
//     // 'no-proto': 2, // 禁止直接使用 Object.prototypes 的内置属性
//     // 'no-redeclare': 2, // 禁止使用 var 多次声明同一变量
//     // 'no-regex-spaces': 2, // 禁止正则表达式字面量中出现多个空格
//     // 'no-return-assign': [2, 'except-parens'], // 禁用指定的通过 require 加载的模块
//     // 'no-self-assign': 2, // 禁止自我赋值
//     // 'no-self-compare': 2, // 禁止自身比较
//     // 'no-sequences': 2, // 禁用逗号操作符
//     // 'no-shadow-restricted-names': 2, // 禁止覆盖受限制的标识符
//     // 'no-spaced-func': 2, // 禁止 function 标识符和括号之间出现空格
//     // 'no-sparse-arrays': 2, // 禁用稀疏数组
//     // 'no-this-before-super': 2, // 禁止在构造函数中，在调用 super() 之前使用 this 或 super
//     // 'no-throw-literal': 2, // 禁止抛出非异常字面量
//     // 'no-trailing-spaces': 2, // 禁用行尾空格
//     // 'no-undef': 2, // 禁用未声明的变量，除非它们在 /*global */ 注释中被提到
//     // 'no-undef-init': 2, // 禁止将变量初始化为 undefined
//     // 'no-unexpected-multiline': 2, // 禁止出现令人困惑的多行表达式
//     // 'no-unmodified-loop-condition': 2, // 禁用一成不变的循环条件
//     // 'no-unneeded-ternary': [2, {
//     //   'defaultAssignment': false
//     // }], // 禁止可以在有更简单的可替代的表达式时使用三元操作符
//     // 'no-unreachable': 2, // 禁止在return、throw、continue 和 break语句之后出现不可达代码
//     // 'no-unsafe-finally': 2,
//     // 'no-unused-vars': [2, {
//     //   'vars': 'all',
//     //   'args': 'none'
//     // }], // 禁止出现未使用过的变量
//     // 'no-useless-call': 2, // 禁止不必要的 .call() 和 .apply()
//     // 'no-useless-computed-key': 2, // 禁止不必要的计算性能键对象的文字
//     // 'no-useless-constructor': 2,
//     // 'no-useless-escape': 0, // 禁用不必要的转义字符
//     // 'no-whitespace-before-property': 2, // 禁止属性前有空白
//     // 'no-with': 2, // 禁用 with 语句
//     // 'one-var': [2, {
//     //   'initialized': 'never'
//     // }], // 强制函数中的变量要么一起声明要么分开声明
//     // 'operator-linebreak': [2, 'after', {
//     //   'overrides': {
//     //     '?': 'before',
//     //     ':': 'before'
//     //   }
//     // }], // 强制操作符使用一致的换行符
//     // 'padded-blocks': [2, 'never'], // 要求或禁止块内填充
//     // 'quotes': [2, 'single', {
//     //   'avoidEscape': true,
//     //   'allowTemplateLiterals': true
//     // }], // 强制使用一致的反勾号、双引号或单引号
//     // 'semi': [2, 'always'], // 要求或禁止使用分号而不是 ASI（这个才是控制行尾部分号的，）
//     // 'semi-spacing': [2, {
//     //   'before': false,
//     //   'after': true
//     // }], // 强制分号之前和之后使用一致的空格
//     // 'space-before-blocks': [2, 'always'], // 强制在块之前使用一致的空格
//     // 'space-before-function-paren': [2, 'never'], // 强制在 function的左括号之前使用一致的空格
//     // 'space-in-parens': [2, 'never'], // 强制在圆括号内使用一致的空格
//     // 'space-infix-ops': 2, // 要求操作符周围有空格
//     // 'space-unary-ops': [2, {
//     //   'words': true,
//     //   'nonwords': false
//     // }], // 强制在一元操作符前后使用一致的空格
//     // 'spaced-comment': [2, 'always', {
//     //   'markers': ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ',']
//     // }],
//     // 'template-curly-spacing': [2, 'never'], // 要求或禁止模板字符串中的嵌入表达式周围空格的使用
//     // 'use-isnan': 2, // 要求使用 isNaN() 检查 NaN
//     // 'valid-typeof': 2, // 强制 typeof 表达式与有效的字符串进行比较 -- typeof foo === "undefimed" 错误
//     // 'wrap-iife': [2, 'any'], // 要求 IIFE 使用括号括起来
//     // 'yield-star-spacing': [2, 'both'],
//     // 'yoda': [2, 'never'], // 要求或禁止 “Yoda” 条件
//     // 'prefer-const': 2, // 要求使用 const 声明那些声明后不再被修改的变量
//     // 'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0, // 禁用 debugger
//     // 'object-curly-spacing': [2, 'always', {
//     //   objectsInObjects: false
//     // }],
//     // 指定数组的元素之间要以空格隔开(, 后面)， never参数：[ 之前和 ] 之后不能带空格，always参数：[ 之前和 ] 之后必须带空格
//     // 'array-bracket-spacing': [2, 'never']
//   },
//   settings: {
//     // 通过 eslint-import-resolver-alias 实现 alias 路径别名识别
//     'import/resolver': {
//       alias: {
//         map: [
//           ['@', './src'],
//         ],
//         extensions: ['.js'],
//       },
//     },
//   },
// };

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: ['@antfu', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'none'
      }
    ],
    'antfu/if-newline': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    'eslint-comments/no-unlimited-disable': 'off',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    'no-console': 'off',
    'vue/component-tags-order': 'off',
    // 取消导出可变绑定时使用 const 而不是 let
    'import/no-mutable-exports': 'off',
    // 空格缩进
    indent: ['error', 2, { SwitchCase: 1 }]
    // 'prettier/prettier': [2, { tabWidth: 4, endOfLine: 'auto' }]
  }
};
