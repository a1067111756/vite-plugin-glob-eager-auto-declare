/* 解析声明文件相关 */
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { vconsole, getCompileDirAllDirPaths, parseScriptPathsConfig } from './helper'
import type { PluginOptions, PluginOutPath, PluginScriptPathsConfig } from '../types/index'

const targetDeclareDir = {}

// 方法 - 替换声明文件内容
const formatDeclare = (content: string, importLibs: Array<string>, importDeclare: Array<string>) => {
  let temp = ''

  // 处理声明文件中引入的三方包
  const libs = content.match(/import type.+;/g) || []
  libs.forEach((item) => {
    content = content.replace(item, '')
    importLibs.push(item)
  })

  // 处理声明文件中自定义了interface、type
  const regexInterface = /interface\s+(\w|\d|_)+\s*{[\s\S]*?}/g;
  const regexType = /type\s+(\w|\d|_)+\s*=\s*(?:{[^}]*}|\w[\w\s<>,.:\\[\]]*(?:;|\n))/g;
  const matchesInterface = content.match(regexInterface);
  const matchesType = content.match(regexType);
  const interfaces = matchesInterface ? matchesInterface : [];
  const types = matchesType ? matchesType : [];
  interfaces.forEach(item => {
    content = content.replace(item, '');
    importDeclare.push(item);
  })
  types.forEach(item => {
    content = content.replace(item, '');
    importDeclare.push(item);
  })

  // pinia库处理
  if (content.indexOf('import("pinia").StoreDefinition') !== -1) {
    const regexp = /StoreDefinition<[\s\S]*?{[\s\S]*?}>;/gm
    const matches = content.match(regexp)

    if (matches && matches.length > 0) {
      const params =  matches[0].split(',')
      // 普通声明
      const normalDeclarations = []
      // 声明引用了其它声明
      const singleDeclarations = []

      params[1].trim().startsWith('{')
        ? normalDeclarations.push(params[1].trim().slice(1, -1))
        : singleDeclarations.push(params[1])

      params[2].trim().startsWith('{')
        ? normalDeclarations.push(params[2].trim().slice(1, -1))
        : singleDeclarations.push(params[2])

      params[3].trim().startsWith('{')
        ? normalDeclarations.push(params[3].trim().slice(1, -3))
        : singleDeclarations.push(params[3].slice(0, -2))


      const singleDeclarationsTemplate = singleDeclarations.length <= 0
        ? ''
        : `& ${singleDeclarations.join(' & ')}`
      return `{ \n ${normalDeclarations.join('')} } ${ singleDeclarationsTemplate };`
    }

    return '{ \n  };'
  }

  // export default 文件唯一导出处理
  if (content.indexOf('export default') !== -1) {
    // 去除export default
    content = content.replace( /^export default .+;?/gm, '');

    // 去除declare const
    if (content.includes('=>')) {
      return content.replace(/[^:]*:/, '')
    } else if (content.includes('=')) {
      return content.replace(/[^=]*=/, '')
    } else {
      return content
    }
  }

  // 枚举形式处理 -> 转换成键值对对象  export declare enum xxx {} 转=>换 xxx: {}
  if (content.indexOf('export declare enum') !== -1) {
    content = content.replace(/export declare enum/g, '');
    content = content.replace(/{/g, ':{');
    content = content.replace(/=/g, ':');
  }

  // 常量形式处理 -> 转换成键值对对象
  // export declare const xxx = "xxx" 转=>换 xxx: "xxx"
  // export declare const xxx : () => void 转=>换 xxx: () => void
  if (content.indexOf('export declare const') !== -1) {
    const regex = /export declare const (\w+)([^=]*)(=.*)?;/g;
    content = content.replace(regex, (match) => {
      // 函数
      if (match.includes('=>')) {
        return match.replace('export declare const', '')
      // 常量
      } else if (match.includes('=')) {
        return match.replace('export declare const', '').replace('=', ':')
      } else {
        return match
      }
    })
  }

  // 默认将“export declare const”替换为“”
  temp = content.replace(/export declare const/g, '   ');
  return `{ \n ${temp}  };`;
};

// 方法 - 过滤声明文件内容
const filterDeclareContent = (filePath: string, importLibs: Array<string>, importDeclare: Array<string>) => {
  let content = '';

  try {
    content = fs.readFileSync(filePath, { encoding: 'utf-8' });
  } catch (e) {
    console.error(
      '[vite-plugin-globEager-auto-declare] 读取编译后的声明文件失败, error:',
      JSON.stringify(e)
    );
    return null;
  }

  // 如果文件为空 - 不进行操作跳过本次循环
  if (content.trim() === '') {
    return null
  }

  // 1. 将文件名作为key, 2. 将内容中“export declare const”去除
  const fileName = filePath.slice(filePath.lastIndexOf('\\') + 1)
  const key = fileName.slice(0, -5)
  const value = formatDeclare(content, importLibs, importDeclare)
  return `  ${key}: ${value.replace(/export\s*{\s*}\s*;/g, '')}`
}

// 方法 - 解析声明文件
export const parseDeclare = (
  COMPILE_DIR: string,
  OUTPUT_PATH: string,
  gScriptPathConfigs: PluginScriptPathsConfig,
  compileContents: Array<string>,
  importLibs: Array<string>,
  importDeclare: Array<string>
) => {
  vconsole.log(chalk.blue('全局配置:'))
  vconsole.log(`COMPILE_DIR: ${COMPILE_DIR}`)
  vconsole.log(`OUTPUT_PATH: ${OUTPUT_PATH}`)

  vconsole.log(chalk.blue('\n中间文件:'))
  vconsole.log('gScriptPathConfigs:')
  vconsole.dir(gScriptPathConfigs)

  // 遍历声明，查找出解析声明的目录列表
  const compileDirAllDirPaths = getCompileDirAllDirPaths(COMPILE_DIR)
  compileDirAllDirPaths.forEach(cPath => {
    const match = gScriptPathConfigs.find(item => item.path.endsWith(cPath))
    match && (targetDeclareDir[path.join(COMPILE_DIR, cPath)] = match)
  })

  vconsole.log('targetDeclareDir:')
  vconsole.dir(targetDeclareDir)

  // 遍历这些目录得到声明文件列表，并将声明文件进行过滤、替换操作
  const targetDeclareFiles: string[] = []
  Object.keys(targetDeclareDir).forEach((targetDeclarePath: string) => {
    // 声明目录对应的配置
    const { exclude, mountedName } = targetDeclareDir[targetDeclarePath]

    // 读取文件目录
    let declareTemplate = ''
    const declareFiles = fs.readdirSync(targetDeclarePath)

    declareFiles
      // 去除exclude排除的文件
      .filter(fileName => {
        return !exclude.includes(fileName.replace(/\.d\.ts$/, '.ts'))
      })
      // 遍历文件解析
      .forEach((fileName: string) => {
        const filePath = path.join(targetDeclarePath, fileName)
        targetDeclareFiles.push(filePath)
        const content = filterDeclareContent(filePath, importLibs, importDeclare)
        if (!content) return

        declareTemplate = declareTemplate + '\n' + content;
      })

    // 存储到全局的声明文件内容记录池
    compileContents.push(`interface I${mountedName.toUpperCase()}Declare { \n ${declareTemplate} \n}`)
  })

  vconsole.log('targetDeclareFiles:')
  vconsole.dir(targetDeclareFiles)
}

// 方法 - 将记录声明文件内容合并并写入输出文件
export const writeCompileContents = (
  outDeclarePath: PluginOutPath,
  gScriptPathConfigs: PluginScriptPathsConfig,
  gPluginOptions: PluginOptions,
  compileContents: Array<string>,
  importLibs: Array<string>,
  importDeclare: Array<string>
) => {
  try {
    // 导出声明
    const exportTemplate = 'export {}';
    // 三方库模板
    const importLibTemplate = `${importLibs.join('\n')}`;
    // 自定义声明模板
    const customDeclarationsTemplate = `${importDeclare.join('\n')}`;
    // 声明内容
    const declareTemplate = `${compileContents.join('\n')}`;
    // vue属性全局扩展模板
    const vueExtendsPropertyTemplate = () => {
      let template = ''

      parseScriptPathsConfig(gScriptPathConfigs).forEach((gScriptPathConfig) => {
        const { mountedName } = gScriptPathConfig
        template = template + `$${mountedName}: I${mountedName.toUpperCase()}Declare;\n      `;
      })

      // 输出目标
      const target = Array.isArray(gPluginOptions.target) ? gPluginOptions.target : [gPluginOptions.target]
      // 输出模板
      let outTemplate = ''

      // uni
      if (target.includes('uni')) {
        outTemplate = outTemplate +
          `declare global {
            interface Uni extends _Uni {
              ${template}
            }
          }`
      }

      // vue
      if (target.includes('vue')) {
        outTemplate = outTemplate +
          `declare module '@vue/runtime-core' {
            interface ComponentCustomProperties {
              ${template}
            }
          }`
      }

      // 防范错误值
      if (!outTemplate) {
        outTemplate = outTemplate +
          `declare module '@vue/runtime-core' {
            interface ComponentCustomProperties {
              ${template}
            }
          }`
      }

      return outTemplate
    }

    // 输出路径不存在，自动创建
    if (!fs.existsSync(path.join(outDeclarePath, '../'))) {
      fs.mkdirSync(path.join(outDeclarePath, '../'), { recursive: true });
    }

    vconsole.log(chalk.blue('\n最终编译内容:'))
    fs.writeFileSync(outDeclarePath, '// 导出声明 \n', { encoding: 'utf-8', flag: 'w+' });
    fs.writeFileSync(outDeclarePath, exportTemplate, { encoding: 'utf-8', flag: 'a+' });
    vconsole.log('导出声明')
    vconsole.log(exportTemplate)

    fs.writeFileSync(outDeclarePath, '\n\n// 导入三方库 \n', { encoding: 'utf-8', flag: 'a+' });
    fs.writeFileSync(outDeclarePath, importLibTemplate, { encoding: 'utf-8', flag: 'a+' });
    vconsole.log('导入三方库')
    vconsole.log(importLibTemplate)

    fs.writeFileSync(outDeclarePath, '\n\n// 自定义声明 \n', { encoding: 'utf-8', flag: 'a+' });
    fs.writeFileSync(outDeclarePath, customDeclarationsTemplate, { encoding: 'utf-8', flag: 'a+' });
    vconsole.log('自定义声明')
    vconsole.log(customDeclarationsTemplate)

    fs.writeFileSync(outDeclarePath, '\n\n// 自动生成的声明 \n', { encoding: 'utf-8', flag: 'a+' });
    fs.writeFileSync(outDeclarePath, declareTemplate, { encoding: 'utf-8', flag: 'a+' });
    vconsole.log('自动生成的声明')
    vconsole.log(declareTemplate)

    fs.writeFileSync(outDeclarePath, '\n\n// 扩充vue运行时类型 \n', { encoding: 'utf-8', flag: 'a+' });
    fs.writeFileSync(outDeclarePath, vueExtendsPropertyTemplate(), {
      encoding: 'utf-8',
      flag: 'a+'
    });
    vconsole.log('扩充vue运行时类型')
    vconsole.log(vueExtendsPropertyTemplate())
  } catch (e) {
    console.error('[vite-plugin-globEager-auto-declare] 写入声明文件失败, error:', e);
    return
  }

  vconsole.log(chalk.blue('声明输出地址: '), outDeclarePath)
}
