import path from 'path'
import { generateMain } from './lib'
import { parseScriptPathsConfig } from './lib/helper'
import type { PluginScriptPaths, PluginOutPath, PluginOptions, PluginScriptPathsConfig } from '#/index'

// 插件脚本配置
let gScriptPathConfigs: PluginScriptPathsConfig = []

// 最终声明文件输出地址
let gOutPath = ''

// 插件全局选项
let gPluginOptions: PluginOptions = {
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
        throw new Error('[vite-plugin-globEager-auto-declare] error: 配置项存在问题, scriptPaths，outPath是必传参数')
      }

      gScriptPathConfigs = parseScriptPathsConfig(scriptPaths)
      gOutPath = path.join(outPath, 'vue-property-extends.d.ts')
      gPluginOptions = Object.assign({}, gPluginOptions, pluginOptions)
    },
    // 热更新
    handleHotUpdate({ file }: { file: string }) {
      // 检查必要的脚本配置 - 不存在跳过此次更新
      if (!Array.isArray(scriptPaths) || !outPath) {
        console.error('[vite-plugin-globEager-auto-declare] error: 配置项存在问题, scriptPaths，outPath是必传参数')
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

