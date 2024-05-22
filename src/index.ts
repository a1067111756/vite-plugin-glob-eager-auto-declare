import path from 'path'
import { generateMain } from './lib'
import { parseScriptPathsConfig  } from './lib/helper'
import type { PluginScriptPaths, PluginOutPath, PluginOptions, PluginScriptPathsConfig } from './types/index'

// 插件选项参数
let gScriptPathConfigs: PluginScriptPathsConfig = []

// 最终声明文件输出地址
let gOutPath  = ''

// 插件全局选项
let gPluginOptions: PluginOptions = {
  target: 'vue',
  keepLog: false,
  keepCompile: false
}

// 插件注册
export default function VitePluginGlobDeclare(scriptPaths: PluginScriptPaths, outPath?: PluginOutPath, pluginOptions?: PluginOptions) {
  return {
    name: 'vite-plugin-globEager-auto-declare',
    // 只在开发时应用
    apply: 'serve',
    // 插件构建
    buildStart () {
      if (!Array.isArray(scriptPaths) || !outPath) {
        throw new Error('[vite-plugin-globEager-auto-declare] error: 配置项存在问题, scriptOptions，outPath是必传参数')
      }

      gScriptPathConfigs = parseScriptPathsConfig(scriptPaths)
      gPluginOptions = Object.assign({}, gPluginOptions, pluginOptions)

      if (gPluginOptions.target === 'uni') {
        gOutPath = path.join(outPath, 'uni-property-extend.d.ts')
      } else {
        gOutPath = path.join(outPath, 'vue-property-extend.d.ts')
      }
    },
    // 热更新
    handleHotUpdate({ file }: { file: string }) {
      // 检查必要的脚本配置 - 不存在跳过此次更新
      if (!Array.isArray(scriptPaths) || !outPath) {
        console.error('[vite-plugin-globEager-auto-declare] error: 配置项存在问题, scriptOptions，outPath是必传参数')
        return
      }

      if (scriptPaths.length <= 0) {
        console.error('[vite-plugin-globEager-auto-declare] error: 编译目录为空, scriptOptions为空数组')
        return
      }

      // 目标文件变动，执行声明编译流程
      const watchFile = gScriptPathConfigs.map(item => path.normalize(item.path))
      const changeFile = path.normalize(file)
      if (watchFile.some(file => changeFile.startsWith(file))) {
        generateMain(gScriptPathConfigs, gOutPath, gPluginOptions)
      }
    }
  }
}

