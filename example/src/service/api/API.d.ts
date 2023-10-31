/* 接口数据类型定义 */
declare namespace API {
  /*------------------------------------------ 通用相关 ----------------------------------------*/
  // 分页
  type ICommonGetPageVO<T> = {
    pageNo: number,
    pageSize: number
  } & T
  type ICommonGetPageDTO<T> = {
    total: number,
    list: Array<T>
  }

  /*------------------------------------------ 认证相关 -------------------------------------------*/
  // 获取用户信息
  type IGetUserInfoVO = {
    // 用户账号
    userName: string
  }
  type IGetUserInfoDTO = MODEL.IUserEntity
}
