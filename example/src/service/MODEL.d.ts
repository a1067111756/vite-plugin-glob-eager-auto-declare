/* 数据模型定义 */
declare namespace MODEL {
  /*------------------------------------------ 用户相关 -------------------------------------------*/
  type IUserEntity = {
    // 用户等级
    userLevel: 1 | 2 | 3 | 4,
    // 用户名
    userName: string,
    // 用户昵称
    nickName: string,
    // 用户联系电话
    userPhone: string,
    // 单位名称
    companyName: string,
    // 区县列表 - 区县账号时绑定
    countyList?: Array<string>,
    // 村庄列表 - 乡镇账号时绑定
    townList?: Array<string>,
    // 工程列表 - 村庄账号时绑定
    pjtList?: Array<{
      id: number,
      name: string
    }>
  } & (
    { userLevel: 2, countyList: Array<string> } |
    { userLevel: 3, townList: Array<string> } |
    { userLevel: 4, pjtList: Array<{ id: number, name: string }> }
  )

  /*----------------------------------------- 水务工程相关 --------------------------------------*/
  type IWaterProjectEntity = {
    // 主键
    id: number,
    // 附件
    attachments: string,
    // 具体管护责任人
    chargePerson: string,
    // 管护责任人联系电话
    chargePersonPhone: string,
    // 管护主体
    chargeUnit: string,
    // 所在市州
    city: string,
    // 所在县区
    county: string,
    // 县城水价（元/吨）
    countyWaterPrice: string,
    // 覆盖村、组名称
    coverGroup: string,
    // 覆盖户数（户）
    coverHouse: string,
    // 覆盖人口（人）
    coverPopulation: string,
    // 是否供水入户（是/否）
    enterHouse: string,
    // 是否建立管理制度（是/否）
    hasManageSystem: string,
    // 是否高于县城水价（是/否）
    hasOverCountyPrice: string,
    // 是否正常运行（是/否）
    hasRunRight: string,
    // 是否有消毒设施（是/否）
    hasSterilizeFacility: string,
    // 是否正常投入使用（是/否）
    hasUsed: string,
    // 是否完成水价核定（是/否）
    hasWaterFeeCheck: string,
    // 是否收取水费（是/否）
    hasWaterFeeCollect: string,
    // 是否采取保护措施（是/否）
    hasWaterSourceProtect: string,
    // 工程名称
    pjtName: string,
    // 备注
    remark: string,
    // 规模类型：城市供水管网延伸工程、千吨万人以上工程、百吨千人以上千吨万人以下工程、百吨千人以下集中式工程、分散式工程
    scaleType: string,
    // 项目所在镇
    town: string,
    // 项目所在村
    village: string,
    // 村主任姓名
    villageDirector: string,
    // 村主任电话
    villageDirectorPhone: string,
    // 村支书姓名
    villageSecretary: string,
    // 村支书电话
    villageSecretaryPhone: string,
    // 管水员姓名
    waterManagePerson: string,
    // 管水员电话
    waterManagePersonPhone: string,
    // 执行水价
    waterPrice: string,
    // 水源名称
    waterSourceName: string,
    // 水源类型
    waterSourceType: string,
  }
}
