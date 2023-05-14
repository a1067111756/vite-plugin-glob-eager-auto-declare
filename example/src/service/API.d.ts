/* 接口声明定义 */
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
  // 登录
  type ILoginVO = {
    // 用户名
    username: string,
    // 密码
    password: string
  }
  type ILoginDTO = {
    // token
    access_token: string,
    // 用户账号
    userName: string
  }

  // 修改密码
  type IModifyPasswordVO = {
    // 新密码
    newPwd: string,
    // 旧密码
    oldPwd: string,
    // 确认密码
    rePwd: string
  }

  // 获取用户信息
  type IGetUserInfoVO = {
    // 用户账号
    userName: string,
    // 门户id
    portalId: string
  }
  type IGetUserInfoDTO = MODEL.IUserEntity

  // 创建子账户
  type ICreateChildAccountVO = MODEL.IUserEntity

  /*-------------------------------------- 水务工程相关 ---------------------------------------*/
  // 分页
  type IWaterProjectGetPageVO = ICommonGetPageVO<Partial<Pick<MODEL.IWaterProjectEntity,
    'city'
    | 'scaleType'
    | 'county'
    | 'village'
    | 'town'
    | 'pjtName'
    | 'enterHouse'
    | 'hasManageSystem'
    | 'hasOverCountyPrice'
    | 'hasRunRight'
    | 'hasSterilizeFacility'
    | 'hasUsed'
    | 'hasWaterFeeCheck'
    | 'hasWaterFeeCollect'
    | 'hasWaterSourceProtect'
    > & {
    // 覆盖人口（人） 大于该值
    coverPopulationDown?: number,
    // 覆盖人口（人） 小于该值
    coverPopulationUp?: number,
  }>>
  type IWaterProjectGetPageDTO = ICommonGetPageDTO<MODEL.IWaterProjectEntity>

  // 列表
  type IWaterProjectGetListVO = Omit<IWaterProjectGetPageVO, 'pageNo' | 'pageSize'>
  type IWaterProjectGetListDTO = Pick<IWaterProjectGetPageDTO, 'list'>

  // 详情
  type IWaterProjectGetByIdDTO = MODEL.IWaterProjectEntity

  /*-------------------------------------- 统计相关 ---------------------------------------*/
  // 统计单项数据结构
  type IIStatisticItemDTO = {
    category: string,
    val: number
  }

  // 所有统计
  type IStatisticGetAllVO = {
    // 区县
    county: string,
    // 乡镇
    town?: string
  } | {
    county: string,
    town: string
  }
  type IStatisticGetAllDTO = {
    // 是否供水入户统计
    enterHouseStats: Array<IIStatisticItemDTO>,
    // 是否建立管理制度统计
    hasManageSystemStats: Array<IIStatisticItemDTO>,
    // 是否高于县城水价统计
    hasOverCountyPriceStats: Array<IIStatisticItemDTO>,
    // 是否正常运行统计
    hasRunRightStats: Array<IIStatisticItemDTO>,
    // 是否有消毒设施统计
    hasSterilizeFacilityStats: Array<IIStatisticItemDTO>,
    // 是否正常投入使用统计
    hasUsedStats: Array<IIStatisticItemDTO>,
    // 是否完成水价核定统计
    hasWaterFeeCheckStats: Array<IIStatisticItemDTO>,
    // 是否收取水费统计
    hasWaterFeeCollectStats: Array<IIStatisticItemDTO>,
    // 是否采取保护措施统计
    hasWaterSourceProtectStats: Array<IIStatisticItemDTO>,
    // 区域数据统计
    regionStats: Array<IIStatisticItemDTO>,
    // 规模类型统计
    scaleTypeStats: Array<IIStatisticItemDTO>
  }
}
