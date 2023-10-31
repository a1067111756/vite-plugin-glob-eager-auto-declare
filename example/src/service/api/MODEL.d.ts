/* 接口数据类型定义 */
declare namespace MODEL {
  type IUserInfoEntity = {
    // 用户头像
    avatar: string,
    // 用户等级
    userLevel: 1 | 2 | 3 | 4,
    // 用户名
    userName: string,
    // 用户昵称
    nickName: string,
    // 用户联系电话
    userPhone: string,
    // 单位名称
    companyName: string
  }
}
