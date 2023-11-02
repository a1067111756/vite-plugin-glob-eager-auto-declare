# 🚀 vite-plugin-glob-eager-auto-declare

> 🔥 vite插件 - 自动扫描生成声明文件挂载到vue ComponentCustomProperties全局属性扩展

### 一、插件的背景和目标
___
- 背景 - 开发业务时，虽然在用vue3，但是习惯vue2的this写法，将全局相关的配置挂载到实例上
        可以很方便的使用。但存在一个问题是，编辑器无法推导代码提示，很头疼这个问题，开发
        体验大大降低。vue3大大增强了typescript的支持，是可以实现全局属性扩展推导的，
        那编辑器就可以依赖ts的插件来实现代码提示

- 目标 - 实现业务中常用的全局配置声明的自动生成，挂载到vue实例，实现代码提示

- 原理 - 插件会扫描指定注册的文件，监听到文件更新，就会执行tsc去编译文件生成声明文件，声
        名文件通过扩展vue的ComponentCustomProperties全局属性，进而使编辑器的ts插件进行
        推导，实现代码提示

- 声明 - 该插件旨在减化自己工作中重复工作的工具，实现原理简单，自身能力有限，使用者勿喷，
        如果有好的想法和建议也可在issue中提出

### 二、插件的注册
___

Install:
```bash
$ npm install vite-plugin-glob-eager-auto-declare
```

Use in vite.config.ts for register plugin:
```javascript
import GlobEagerAutoDeclarePlugin from 'vite-plugin-glob-eager-auto-declare'

export default defineConfig({
  plugins: [
    GlobEagerAutoDeclarePlugin(
      // 注册扫描的文件
      [
        path.resolve(__dirname, 'src/service/constant'),
        path.resolve(__dirname, 'src/common/properties'),
      ],
      // 生成声明文件输出路径
      path.resolve(__dirname, 'types')
    )
  ]
})
```

enable your ts plugin in tsconfig.json:
```javascript
  {
      // tsconfig.json的include字段包含生成声明文件的路径，告诉ts需要引用这些声明
      "include": [
        "types/**/*.ts",
        "types/**/*.d.ts"  
      ]
  }
```

### 三、组件支持选项
___
```javascript
GlobEagerAutoDeclarePlugin(
  // 第一个参数是数组，注册扫描的文件，包含你需要扫描的文件夹路径
  [
    // 可以直接给路径，挂载的属性名默认取文件夹名  appInstance.$constant
    path.resolve(__dirname, 'src/service/constant'),
    // 可以加入mountedName选项，挂载的属性名优先取mountedName字段  appInstance.$store
    {
      path: path.resolve(__dirname, 'src/service/store/modules'),
      mountedName: 'store'
    },
    // 可以加入exclude选项，exclude表示排除该文件夹下文哪些文件不参与编译
    // 以下就是文件夹src/service/store/modules下排除index.ts文件不编译
    {
      path: path.resolve(__dirname, 'src/service/store/modules'),
      exclude: ['index.ts']
    },
  ],
  // 第二个参数是字符串，生成声明文件输出路径
  path.resolve(__dirname, 'types'),
  // 第三个参数是object，插件相关注入选项
  {
    // 是否打开编译日志 - 用于调试查看编译异常很有帮助
    keepLog: true,
    // 是否保留编译声明中间文件 - 用于调试查看tsc编译后的原始声明
    keepCompiler: false
  }
)
```

### 四、注意事项
```
1. 很重要! 很重要! 很重要! 这是一个实验性质的项目，对于开发体验很好，还是很实用，
   但当前插件版本并非稳定版本，请谨慎使用。主要原因还是在tsc编译的声明文件，和最终
   挂载到vue ComponentCustomProperties需要的声明内容并不是完全一致的，插件内部
   写了大量的替换、过滤来实现声明文件到挂载属性的转换，这部分功能不是很稳定!!!
   
2. 关于插件的效率，由于插件原理是通过tsc来编译声明文件，还需要转换声明文件为挂载属性
   这部分还是需要耗时的，自测时间在几秒内完成，不算很长。关于效率问题做了以下优化
   第一版本：插件在项目启动时才去编译，编译整个项目的声明。
     问题： a. 写代码时全局配置随时都在修改，只有重启项目声明才能重新编译
           b. 编译整个项目声明，耗时很长
   第二版本：借vite插件的热更新手段，当注册文件发生变化时，就重新编译，并指定tsc只
            编译注册的文件来提高效率
```

### 五、使用demo(以下是我运用此插件来生成声明代码提示的一些场景)
以下示例只是展示了使用示例，模块的自动化注册是需要自己编写的，不是本插件管控功能，
此插件只是生成声明代码提示，没有涉及模块自动化注册，以下是一个api模块的自动化
注册，仅供参考
```
    /* api接口集中管理自动注册
     *    规则: a. 自动检测当前目录下的脚本文件
     *         b. 脚本文件必须export导出(因为一个模块可能会有多个导出接口)
     *         c. 脚本会自动注册一个以 $api.[fileName] 的全局属性提供外部调用
     *              eg：$api.auth.xxx
     */
    import type {App} from 'vue'
    
    const install = (app: App) => {
        // api集合
        const apiList: Record<string, any> = {}
        
        // 查找文件
        const modules = import.meta.glob('./modules/**/*.ts', { eager: true })
        
        // api接口分模块注入
        for (const fileName in modules) {
            const splitFileName = fileName.split('/')
            const apiKey: string = splitFileName[splitFileName.length - 1].slice(0, -3)
            apiList[apiKey] = modules[fileName]
        }
    
        // 将api集合挂载到$api属性
        app.config.globalProperties.$api = apiList as any
    }
    
    export default install
```

1) pinia声明，别问我为什么不是vuex，已经被我抛弃了
```
   目录结构如下：
   src
    ├─ store
      ├─ modules        
        ├─ xxx.ts           
        └─ example.ts
    
    -----------------------------------------------------------------
    // vite.config.ts
    GlobEagerAutoDeclarePlugin(
      // 第一个参数是数组，注册扫描的文件，包含你需要扫描的文件夹路径
      [
        {
          path: path.resolve(__dirname, 'src/store/modules'),
          mountedName: 'store'
        }
      ],
      path.resolve(__dirname, 'types'),
    )
    
    -----------------------------------------------------------------
    // src/store/modules/example.ts    
    import { defineStore } from 'pinia';

    interface ExampleState {
      count: number;
    }
    
    export const useExampleStore = defineStore({
      id: 'example',
      
      state: (): ExampleState => ({
        count: 0
      }),
      
      getters: {
        getDoubleCount(): number {
          return this.count * 2
        }	
      },
      actions: {
        setCount(): void {
          this.count = this.count + 1
        }
      }
    })
    ----------------------------------------------------------------
    // xxx.vue
    <script setup>
       // vue实例
       const appInstance = useAppContext()
       
       // 调用store(实例.$store.模块名.具体属性)
       appInstance.$store.example.count
       appInstance.$store.example.getDoubleCount()
       appInstance.$store.example.setCount()
    </script>
```

2) api接口声明
```
   目录结构如下：
   src
    ├─ api
      ├─ modules        
        ├─ xxx.ts           
        └─ auth.ts
    
    -----------------------------------------------------------------
    // vite.config.ts
    GlobEagerAutoDeclarePlugin(
      // 第一个参数是数组，注册扫描的文件，包含你需要扫描的文件夹路径
      [
        {
          path: path.resolve(__dirname, 'src/api/modules'),
          mountedName: 'api'
        }
      ],
      path.resolve(__dirname, 'types'),
    )
    
    -----------------------------------------------------------------
    // src/api/modules/auth.ts    
    import { request } from '@/common/plugins/requestPlugin'

    // 登录
    export const login = 
        (loginVO: API.ILoginVO): API.ILoginDTO => request({
          url: '/user/login',
          data: loginVO
        })
    
    // 登出
    export const logout = 
        (logoutVO: API.ILogoutVO): API.ILogoutDTO => request({
          url: '/user/logout',
          data: logoutVO
        })

    ----------------------------------------------------------------
    // xxx.vue
    <script setup>
       // vue实例
       const appInstance = useAppContext()
       
       // 调用api(实例.$api.模块名.具体属性)
       appInstance.$api.auth.login(loginVO)
       appInstance.$api.auth.logout(logoutVO)
    </script>
```

3) 全局属性声明
```
   目录结构如下：
   src
    ├─ properties
       ├─ helper.ts           
       └─ require.ts
    
    -----------------------------------------------------------------
    // vite.config.ts
    GlobEagerAutoDeclarePlugin(
      // 第一个参数是数组，注册扫描的文件，包含你需要扫描的文件夹路径
      [
        {
          path: path.resolve(__dirname, 'src/properties'),
        }
      ],
      path.resolve(__dirname, 'types'),
    )
    
    -----------------------------------------------------------------
    // src/properties/helper.ts (多对象导出)   
   
    export const appSetting = {
      title: 'xxx应用名称',
      subTitle: 'xxx应用名称'  
    }
    
    export const setAppName = (name: string) => {
      console.log(name)
    }
    
    -----------------------------------------------------------------
    // src/properties/require.ts (默认导出)   
   
    const require = (path: string) => {
      if (path.startsWith('@')) {
        const filepath = path.replace(/@/, '/src')
        return new URL(import.meta.url).origin + filepath
      } else {
        return new URL(path, import.meta.url).href
      }
    }

    export default require

    ----------------------------------------------------------------
    // xxx.vue
    <script setup>
       // vue实例
       const appInstance = useAppContext()
       
       // 调用properties(实例.$properties.模块名.具体属性)
       appInstance.$properties.helper.appSetting
       appInstance.$properties.helper.setAppName('xxx应用名称')
       appInstance.$properties.require('xxxxxx')
    </script>
```

4) 全局常量、枚举
```
   目录结构如下：
   src
    ├─ constant
       ├─ const.ts      
       ├─ dict.ts        
       └─ enum.ts
    
    -----------------------------------------------------------------
    // vite.config.ts
    GlobEagerAutoDeclarePlugin(
      // 第一个参数是数组，注册扫描的文件，包含你需要扫描的文件夹路径
      [
        {
          path: path.resolve(__dirname, 'src/constant'),
        }
      ],
      path.resolve(__dirname, 'types'),
    )
    
    -----------------------------------------------------------------
    // src/constant/const.ts  
   
    export const STORAGE_KEY_AUTH_TOKEN = 'auth_token'
    
    export const STORAGE_KEY_AUTH_USERINFO = 'auth_userinfo'
    
    -----------------------------------------------------------------
    // src/constant/dict.ts  
   
    // 性别
    export const SEX = [
      { label: '男', value: 'man' },
      { label: '女', value: 'woman' },
    ]
    
    // 支付方式
    export const CONFISCATE_WAY_TYPE = [
      { label: '微信', value: '微信' },
      { label: '支付宝', value: '支付宝' },
      { label: '现金', value: '现金' },
      { label: '其它', value: '其它' }
    ]
    
    -----------------------------------------------------------------
    // src/properties/enum.ts
   
    export enum ACCOUNT_LEVEL {
      // 市级账号
      CITY = 1,
      // 区县账号
      COUNTRY = 2,
      // 乡镇账号
      TOWN = 3
    }

    ----------------------------------------------------------------
    // xxx.vue
    <script setup>
       // vue实例
       const appInstance = useAppContext()
       
       // 调用constant(实例.$constant.模块名.具体属性)
       appInstance.$constant.const.STORAGE_KEY_AUTH_TOKEN
       appInstance.$constant.dict.SEX[0].label
       appInstance.$constant.enum.ACCOUNT_LEVEL.CITY
    </script>
```

