// 导出声明
export {}

// 导入三方库

// 自定义声明
interface DICT_TYPE {
  label: string | number | boolean
  value: string | number | boolean
  enum: string | number | boolean
}
interface DICT_2_ENUM_TYPE {
  [key: string | number | boolean]: string | number | boolean
}

// 自动生成的声明
interface IAPIDeclare {
  const: {
    STORAGE_KEY_AUTH_TOKEN: 'auth_token'
    STORAGE_KEY_AUTH_USERINFO: 'auth_userinfo'
    STORAGE_KEY_AUTH_PAW: 'auth_pawssss'
  }
  dict: {
    ACCOUNT_LEVEL: {
      label: string
      value: number
      enum: string
    }[]
    WATER_PROJECT_TYPE: {
      label: string
      value: string
      enum: string
    }[]
    getLabelByValue: (
      dictName: string,
      value: string | number | boolean
    ) => string | number | boolean | undefined
    getLabelByEnum: (
      dictName: string,
      enumName: string | number | boolean
    ) => string | number | boolean | undefined
    getValueByLabel: (
      dictName: string,
      label: string | number | boolean
    ) => string | number | boolean | undefined
    getValueByEnum: (
      dictName: string,
      enumName: string | number | boolean
    ) => string | number | boolean | undefined
    getEnumByLabel: (
      dictName: string,
      label: string | number | boolean
    ) => string | number | boolean | undefined
    getEnumByValue: (
      dictName: string,
      value: string | number | boolean
    ) => string | number | boolean | undefined
    getDictItemByLabel: (
      dictName: string,
      label: string | number | boolean
    ) => DICT_TYPE | undefined
    getDictItemByValue: (
      dictName: string,
      value: string | number | boolean
    ) => DICT_TYPE | undefined
    getDictItemByEnum: (
      dictName: string,
      enumName: string | number | boolean
    ) => DICT_TYPE | undefined
    getDict2Enum: (dictName: string) => DICT_2_ENUM_TYPE | undefined
  }
  enum: {
    ACCOUNT_LEVEL: {
      CITY: 1
      COUNTRY: 2
      TOWN: 3
      MANAGER: 4
    }
  }
}

// 扩充vue运行时类型
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $api: IAPIDeclare
    $constant: ICONSTANTDeclare
  }
}
