import { Plugin } from 'vite'

// 默认导出
declare function GlobEagerAutoDeclarePlugin(scriptPaths: PluginScriptPaths, outPath?: PluginOutPath, pluginOptions?: PluginOptions): Plugin;
export default GlobEagerAutoDeclarePlugin;

// 插件编译脚本路径
export type PluginScriptPaths = Array<string | {
  // 编译文件地址
  path: string,
  // 排除不需要编译的文件
  exclude?: Array<string>,
  // 编译模块挂载的最终名，默认值是文件夹名
  mountedName?: string
}>

// 插件输出脚本路径
export type PluginOutPath = string

// 插件全局选项
export type PluginOptions = {
  // 是否输出打印
  keepLog?: boolean,
  // 是否保留编译目录
  keepCompile?: boolean
}

// 插件编译脚本配置
export type PluginScriptPathsConfig = Array<{
  path: string,
  exclude: Array<string>,
  mountedName: string
}>
