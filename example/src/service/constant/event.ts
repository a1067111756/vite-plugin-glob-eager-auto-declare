/* 全局事件定义 */

/*-------------------------------- 一张图相关事件 ------------------------------------------*/
// bus事件 - 说明：打开关联工程列表弹窗 参数:（pjtList: 关联工程列表的信息）
export const BUS_A_PICTURE$PROJECT_LIST_POPUP$OPEN = 'BUS_A_PICTURE$PROJECT_LIST_POPUP$OPEN'
export const BUS_A_PICTURE$PROJECT_LIST_POPUP$CLOSE = 'BUS_A_PICTURE$PROJECT_LIST_POPUP$CLOSE'

// bus事件 - 说明：打开工程详情弹窗 参数:（id: 工程项目id）
export const BUS_A_PICTURE$PROJECT_DETAIL_POPUP$OPEN = 'BUS_A_PICTURE$PROJECT_DETAIL_POPUP$OPEN'
export const BUS_A_PICTURE$PROJECT_DETAIL_POPUP$CLOSE = 'BUS_A_PICTURE$PROJECT_DETAIL_POPUP$CLOSE'

// bus事件 - 说明：一张图地图定位 参数:（coordinates: 定位坐标）
export const BUS_A_PICTURE$MAP$LOCATION = 'BUS_A_PICTURE$MAP$LOCATION'

// bus事件 - 说明：一张图地图选中工程定位 参数:（id: 工程项目id）
export const BUS_A_PICTURE$MAP_PROJECT$LOCATION = 'BUS_A_PICTURE$MAP_PROJECT$LOCATION'

// bus事件 - 说明：消息读取
export const BUS_HOME$MESSAGE$READ_REFRESH = 'BUS_HOME$MESSAGE$READ_REFRESH'

