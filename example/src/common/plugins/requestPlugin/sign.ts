import dayjs from 'dayjs'
import CryptoJs from 'crypto-js'

const TTL = 180
const CLIENT = 'fawkes'
const CLIENT_SECRET = 'fawkes_secret'

const Dvalue = () => {
  return 0
}

const objTransUrlParams = (obj: any) => {
  const params: Array<any> = []
  Object.keys(obj).forEach((key) => {
    let value = obj[key]
    if (typeof value === 'undefined') {
      value = ''
    }
    params.push([key, value].join('='))
  })
  return params.join('&')
}

const isEmpty = function (val: any) {
  // null or undefined
  if (val == null) return true

  if (typeof val === 'boolean') return false

  if (typeof val === 'number') return !val

  if (val instanceof Error) return val.message === ''

  switch (Object.prototype.toString.call(val)) {
    // String or Array
    case '[object String]':
    case '[object Array]':
      return !val.length

    // Map or Set or File
    case '[object File]':
    case '[object Map]':
    case '[object Set]': {
      return !val.size
    }
    // Plain Object
    case '[object Object]': {
      return !Object.keys(val).length
    }
  }

  return false
}

const sortUrlParams = (str: any) => {
  if (typeof str !== 'string') {
    return {}
  }
  const paramObj = {}
  const paramArr = decodeURI(str).split('&')

  for (let i = 0; i < paramArr.length; i++) {
    const tmp = paramArr[i].split('=')
    const key = tmp[0]
    const value = tmp[1] || ''
    //if (typeof value === 'string' && isNaN(Number(value)) === false && value !== "") {
    //  value = Number(value);
    //}
    if (typeof paramObj[key] === 'undefined') {
      paramObj[key] = value
    } else {
      const newValue = Array.isArray(paramObj[key]) ? paramObj[key] : [
        paramObj[key]
      ]
      newValue.push(value)
      paramObj[key] = newValue
    }
  }
  return paramObj
}

const objKeySort = (obj: any) => {
  const newkey = Object.keys(obj).sort()
  const newObj = {}
  for (let i = 0; i < newkey.length; i++) {
    newObj[newkey[i]] = obj[newkey[i]]
  }
  return newObj
}

/**
 * @rest {object} 对象中的属性为需要加密的属性
 * @example getSign({ f8s: fileToken })
 * @return
 * {
    f8s: "c15cf2e99c9b46cfc4ced4d2301b6aef"
    sign: "AuBRUDz6qzBXW4B+sg1GiptuIys="
    ts: "1602499441622"
    ttl: "30"
    uid: "fawkes"}
 */
export const getSign = (rest: any) => {
  let Params = ''
  const ts = dayjs().unix() + Dvalue()
  const ttl = TTL
  const obj = rest
  Params += 'ts=' + ts + '&ttl=' + ttl + '&uid=' + CLIENT + (isEmpty(obj) ? '' : '&' + objTransUrlParams(obj))
  let ParamArr = sortUrlParams(Params)
  ParamArr = objKeySort(ParamArr)
  const tempParams: string[] = []
  for (const i in ParamArr) {
    tempParams.push(i + '=' + ParamArr[i])
  }
  const paramsStr = tempParams.join('&')
  const signWordArray = CryptoJs.HmacSHA1(paramsStr, CLIENT_SECRET)
  const sign = CryptoJs.enc.Base64.stringify(signWordArray)
  return { sign, ts, ttl, uid: CLIENT, ...ParamArr }
}
