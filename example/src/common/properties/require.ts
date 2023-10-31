/* vite版本require函数，用于导入全局资源 */
const require = (path: string) => {
  if (path.startsWith('@')) {
    const filepath = path.replace(/@/, '/src')
    return new URL(import.meta.url).origin + filepath
  } else {
    return new URL(path, import.meta.url).href
  }
}

export default require
