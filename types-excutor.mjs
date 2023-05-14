import fs from "fs-extra"

// 1. 复制声明文件到dist
fs.copySync('./types', './dist/types')

// 2. 复制样式文件到dist
fs.copySync('./src/.prettierrc', './dist/.prettierrc')
