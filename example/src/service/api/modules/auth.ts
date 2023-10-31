/* 用户认证相关 */
import { request } from '@/common/plugins/requestPlugin'

// 获取用户信息
export const getUserInfo = (getUserInfoVO: API.IGetUserInfoVO): API.IGetUserInfoDTO => request({
  url: '/user/current',
  data: getUserInfoVO
})
