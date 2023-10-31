import fs from "fs-extra"

// 1. 复制声明文件到dist
fs.copySync('./src/types', './dist/types')

// 2. 复制prettierrc样式文件到dist
fs.copySync('./src/.prettierrc', './dist/.prettierrc')

// 3. 复制ts配置文件文件到dist
fs.copySync('./src/tsconfigOrigin.json', './dist/tsconfigOrigin.json')
