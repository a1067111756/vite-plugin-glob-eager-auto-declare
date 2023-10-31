// 导出声明
export {}

// 导入三方库

// 自定义声明
interface DICT_TYPE {
  label: string | number | boolean
  value: string | number | boolean
  enum: string | number | boolean
  [key: string]: string | number | boolean
}
interface DICT_2_ENUM_TYPE {
  [key: string | number | boolean]: string | number | boolean
}
interface ExampleState {
  count: number
}

// 自动生成的声明
interface IPROPERTIESDeclare {
  helper: {
    media: (size: {
      sm?: number
      md?: number
      lg?: number
      xl?: number
      xl2?: number
      default: number
    }) => number
    snackbarInfo: 'this is a global message info'
  }
  require: (path: string) => string
}
interface IAPIDeclare {
  auth: {
    getUserInfo: (getUserInfoVO: API.IGetUserInfoVO) => API.IGetUserInfoDTO
  }
}
interface ICONSTANTDeclare {
  const: {
    STORAGE_KEY_AUTH_TOKEN: 'auth_token'
    STORAGE_KEY_AUTH_USERINFO: 'auth_userinfo'
    STORAGE_KEY_AUTH_PAW: 'auth_paw'
    STORAGE_KEY_LOCATION_TYPE: 'location_type'
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
    AUDIT_TYPE: {
      label: string
      value: string
    }[]
    WATER_CONFISCATE_WAY_TYPE: {
      label: string
      value: string
    }[]
    MAINTAIN_RUN_STATUS_TYPE: {
      label: string
      value: string
    }[]
    MAINTAIN_DAMAGE_TYPE: {
      label: string
      value: string
    }[]
    MAINTAIN_DEVICE_TYPE: {
      label: string
      value: string
      icon: string
      enum: string
    }[]
    MAINTAIN_DEVICE_MONITOR_STATUS: {
      label: string
      value: number
      enum: string
      color: string
    }[]
    MAINTAIN_DEVICE_STATUS: {
      label: string
      value: string
      enum: string
      color: string
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
  event: {
    BUS_A_PICTURE$PROJECT_LIST_POPUP$OPEN: 'BUS_A_PICTURE$PROJECT_LIST_POPUP$OPEN'
    BUS_A_PICTURE$PROJECT_LIST_POPUP$CLOSE: 'BUS_A_PICTURE$PROJECT_LIST_POPUP$CLOSE'
    BUS_A_PICTURE$PROJECT_DETAIL_POPUP$OPEN: 'BUS_A_PICTURE$PROJECT_DETAIL_POPUP$OPEN'
    BUS_A_PICTURE$PROJECT_DETAIL_POPUP$CLOSE: 'BUS_A_PICTURE$PROJECT_DETAIL_POPUP$CLOSE'
    BUS_A_PICTURE$MAP$LOCATION: 'BUS_A_PICTURE$MAP$LOCATION'
    BUS_A_PICTURE$MAP_PROJECT$LOCATION: 'BUS_A_PICTURE$MAP_PROJECT$LOCATION'
    BUS_HOME$MESSAGE$READ_REFRESH: 'BUS_HOME$MESSAGE$READ_REFRESH'
  }
}
interface ISTOREDeclare {
  example: {
    getDoubleCount(): number

    setCount(): void
  } & ExampleState
}

// 扩充vue运行时类型
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $constant: ICONSTANTDeclare
    $properties: IPROPERTIESDeclare
    $api: IAPIDeclare
    $store: ISTOREDeclare
  }
}
