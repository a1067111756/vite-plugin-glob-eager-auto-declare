/* 解析声明文件相关 */
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { vconsole, getExtraRelativePath, parseScriptPathsConfig } from './helper'
import type { PluginOutPath, PluginScriptPathsConfig } from '#/index'

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
      const normalDeclarations: string[] = []
      // 声明引用了其它声明
      const singleDeclarations: string[] = []

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

  // 如果声明的是枚举形式 -> 转换成键值对对象  export declare enum xxx {}; 转换为 xxx: {}
  if (content.indexOf('export declare enum') !== -1) {
    temp = content.replace(/export declare enum/g, '');
    temp = temp.replace(/{/g, ':{');
    temp = temp.replace(/=/g, ':');
    return `{ \n ${temp}  };`;
  }

  // 如果声明的是常量形式 -> 转换成键值对对象  export declare const xxx = "xxx"; 转换为 xxx: "xxx"
  if (content.indexOf('=>') === -1 && content.indexOf('=') !== -1) {
    temp = content.replace(/export declare const/g, '');
    temp = temp.replace(/=/g, ':');
    return `{ \n ${temp}  };`;
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
  vconsole.log('全局配置:')
  vconsole.log(`COMPILE_DIR: ${COMPILE_DIR}`)
  vconsole.log(`OUTPUT_PATH: ${OUTPUT_PATH}`)

  vconsole.log('\n中间文件:')
  vconsole.log('gScriptPathConfigs:')
  vconsole.dir(gScriptPathConfigs)

  // 从插件配置中读取目标声明目录列表
  const targetDeclareDir = gScriptPathConfigs
    // 筛除不存在的目录
    .filter(item => {
      if (!fs.existsSync(item.path)) {
        vconsole.log(`${item.path}不存在跳过`)
        return false
      }
      return true
    })
    // 遍历得到编译后目录
    .map(item => {
      const extraRelativePath = getExtraRelativePath(item.path, COMPILE_DIR)
      return extraRelativePath
          ? path.resolve(COMPILE_DIR, extraRelativePath)
          : undefined
    })
    .filter(item => item)

  vconsole.log('targetDeclareDir:')
  vconsole.dir(targetDeclareDir)

  const targetDeclareFiles: string[] = []

  // 遍历这些目录得到声明文件列表，并将声明文件进行过滤、替换操作
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  targetDeclareDir.forEach((targetDeclarePath: string, index: number) => {
    // 声明目录对应的配置
    const { exclude, mountedName } = gScriptPathConfigs[index]

    // 读取文件目录
    let declareTemplate = ''
    const declareFiles = fs.readdirSync(targetDeclarePath)

    declareFiles
      // 去除exclude排除的文件
      .filter(fileName => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
  compileContents: Array<string>,
  importLibs: Array<string>,
  importDeclare: Array<string>,
  prettierrcPath: string
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

      return `declare module '@vue/runtime-core' { 
              interface ComponentCustomProperties { 
                ${template} 
              }
            }
          `
    }

    // 输出路径不存在，自动创建
    if (!fs.existsSync(path.join(outDeclarePath, '../'))) {
      fs.mkdirSync(path.join(outDeclarePath, '../'), { recursive: true });
    }

    vconsole.log('\n最终编译内容:')
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

  console.log(outDeclarePath)
  // 使用eslint格式化文件
  try {
    execSync(`prettier --config ${prettierrcPath} --write ${outDeclarePath}`);
  } catch (e) {
    console.log('[vite-plugin-globEager-auto-declare] prettier格式化命令出错');
  }

  console.log('[vite-plugin-globEager-auto-declare] 自动生成声明文件执行成功');
}
