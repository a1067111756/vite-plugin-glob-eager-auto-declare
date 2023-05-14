/* 字典定义 */
import * as DICT from './dict';

interface DICT_TYPE {
  label: string | number | boolean
  value: string | number | boolean
  enum: string | number | boolean
}

interface DICT_2_ENUM_TYPE {
  [key: string | number | boolean]: string | number | boolean
}

/*--------------------------------------- 本地字典 ------------------------------------------*/
// 子账号等级
export const ACCOUNT_LEVEL = [
  { label: '市级账号', value: 1, enum: 'CITY' },
  { label: '区县账号', value: 2, enum: 'COUNTRY' },
  { label: '乡镇账号', value: 3, enum: 'TOWN' },
  { label: '管水员账号', value: 4, enum: 'MANAGER' }
]

// 水务工程项目类型
export const WATER_PROJECT_TYPE = [
  { label: '城市供水管网延伸工程', value: '城市供水管网延伸工程', enum: 'CITY_LEVEL' },
  { label: '千吨万人以上工程', value: '千吨万人以上工程', enum: 'THOUSANDS_LEVEL' },
  { label: '百吨千人以上工程', value: '百吨千人以上工程', enum: 'HUNDRED_UP_LEVEL' },
  { label: '百吨千人以下工程', value: '百吨千人以下工程', enum: 'HUNDRED_DOWN_LEVEL' },
  { label: '分散式工程', value: '分散式工程', enum: 'DISTRIBUTED_LEVEL' }
]

/*--------------------------------------- 字典工具方法 --------------------------------------*/
// 获取字典项label, 依据value
export const getLabelByValue = (dictName: string, value: string | number | boolean) => {
  if (!DICT[dictName]) {
    console.error(`【constant dict getLabelByValue未找到匹配dictName的字典】: 字典名：${dictName}`)
    return undefined
  }

  const match = DICT[dictName].find(item => item.value === value) as DICT_TYPE

  if (!match) {
    console.error(`【constant dict getLabelByValue未找到匹配value的字典项】: 字典名：${dictName}，value值: ${value}`, DICT[dictName])
    return undefined
  }

  return match.label
}

// 获取字典项label, 依据enum
export const getLabelByEnum = (dictName: string, enumName: string | number | boolean) => {
  if (!DICT[dictName]) {
    console.error(`【constant dict getLabelByEnum未找到匹配dictName的字典】: 字典名：${dictName}`)
    return undefined
  }

  const match = DICT[dictName].find(item => item.enum === enumName) as DICT_TYPE

  if (!match) {
    console.error(`【constant dict getLabelByEnum未找到匹配enum的字典项】: 字典名：${dictName}，enum值：${enumName}`, DICT[dictName])
    return undefined
  }

  return match.label
}

// 获取字典项value, 依据label
export const getValueByLabel = (dictName: string, label: string | number | boolean) => {
  if (!DICT[dictName]) {
    console.error(`【constant dict getValueByLabel未找到匹配dictName的字典】: 字典名：${dictName}`)
    return undefined
  }

  const match = DICT[dictName].find(item => item.label === label) as DICT_TYPE

  if (!match) {
    console.error(`【constant dict getValueByLabel未找到匹配label的字典项】: 字典名：${dictName}，label值：${label}`, DICT[dictName])
    return undefined
  }

  return match.value
}

// 获取字典项value, 依据enum
export const getValueByEnum = (dictName: string, enumName: string | number | boolean) => {
  if (!DICT[dictName]) {
    console.error(`【constant dict getValueByEnum未找到匹配dictName的字典】: 字典名：${dictName}`)
    return undefined
  }

  const match = DICT[dictName].find(item => item.enum === enumName) as DICT_TYPE

  if (!match) {
    console.error(`【constant dict getValueByEnum未找到匹配enum的字典项】: 字典名：${dictName}，enum值：${enumName}`, DICT[dictName])
    return undefined
  }

  return match.value
}

// 获取字典项enum, 依据label
export const getEnumByLabel = (dictName: string, label: string | number | boolean) => {
  if (!DICT[dictName]) {
    console.error(`【constant dict getEnumByLabel未找到匹配dictName的字典】: 字典名：${dictName}`)
    return undefined
  }

  const match = DICT[dictName].find(item => item.label === label) as DICT_TYPE

  if (!match) {
    console.error(`【constant dict getEnumByLabel未找到匹配label的字典项】: 字典名：${dictName}，label值：${label}`, DICT[dictName])
    return undefined
  }

  return match.enum
}

// 获取字典项enum, 依据value
export const getEnumByValue = (dictName: string, value: string | number | boolean) => {
  if (!DICT[dictName]) {
    console.error(`【constant dict getEnumByValue未找到匹配dictName的字典】: 字典名：${dictName}`)
    return undefined
  }

  const match = DICT[dictName].find(item => item.value === value) as DICT_TYPE

  if (!match) {
    console.error(`【constant dict getEnumByValue未找到匹配value的字典项】: 字典名：${dictName}，value值：${value}`, DICT[dictName])
    return undefined
  }

  return match.enum
}

// 获取字典项, 依据label
export const getDictItemByLabel = (dictName: string, label: string | number | boolean) => {
  if (!DICT[dictName]) {
    console.error(`【constant dict getDictItemByLabel未找到匹配dictName的字典】: 字典名：${dictName}`)
    return undefined
  }

  const match = DICT[dictName].find(item => item.label === label) as DICT_TYPE

  if (!match) {
    console.error(`【constant dict getDictItemByLabel未找到匹配label的字典项】: 字典名：${dictName}，label值: ${label}`, DICT[dictName])
    return undefined
  }

  return match
}

// 获取字典项, 依据value
export const getDictItemByValue = (dictName: string, value: string | number | boolean) => {
  if (!DICT[dictName]) {
    console.error(`【constant dict getDictItemByValue未找到匹配dictName的字典】: 字典名：${dictName}`)
    return undefined
  }

  const match = DICT[dictName].find(item => item.value === value) as DICT_TYPE

  if (!match) {
    console.error(`【constant dict getDictItemByValue未找到匹配value的字典项】: 字典名：${dictName}，value值：${value}`, DICT[dictName])
    return undefined
  }

  return match
}

// 获取字典项, 依据enum
export const getDictItemByEnum = (dictName: string, enumName: string | number | boolean) => {
  if (!DICT[dictName]) {
    console.error(`【constant dict getDictItemByEnum未找到匹配dictName的字典】: 字典名：${dictName}`)
    return undefined
  }

  const match = DICT[dictName].find(item => item.enum === enumName) as DICT_TYPE

  if (!match) {
    console.error(`【constant dict getDictItemByEnum未找到匹配enum的字典项】: 字典名：${dictName}，enum值：${enumName}`, DICT[dictName])
    return undefined
  }

  return match
}

// 获取字典转枚举
export const getDict2Enum = (dictName: string) => {
  if (!DICT[dictName]) {
    console.error(`【constant dict getDict2Enum未找到匹配dictName的字典】: 字典名：${dictName}`)
    return undefined
  }

  if (DICT[dictName].some(item => item.enum === undefined)) {
    console.error(`【constant dict getDict2Enum字典项中存在enum空值情况，请检查】: 字典名：${dictName}`)
    return undefined
  }

  const enumList = {} as DICT_2_ENUM_TYPE
  DICT[dictName].forEach(item => {
    enumList[item.enum] = item.value
  })

  return enumList
}
