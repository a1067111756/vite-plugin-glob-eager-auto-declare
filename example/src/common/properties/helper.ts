/* 全局工具函数 */
// 媒体查询转换
export const media = (size: { sm?: number, md?: number, lg?: number, xl?: number, xl2?: number, default: number }) => {
  // 断点
  const breakpoint = {
    sm: 500,
    md: 600,
    lg: 1024,
    xl: 1280,
    xl2: 1536
  }

  // 获取当前屏幕尺寸
  const innerWidth = window.innerWidth
  if (innerWidth < breakpoint.sm) {
    return size.sm ?? size.default
  } else if (innerWidth >= breakpoint.sm && innerWidth < breakpoint.md) {
    return size.md ?? size.sm ?? size.default
  } else if (innerWidth >= breakpoint.md &&  innerWidth < breakpoint.lg) {
    return size.lg ?? size.md ?? size.sm ?? size.default
  } else if (innerWidth >= breakpoint.lg &&  innerWidth < breakpoint.xl) {
    return size.xl ?? size.lg ?? size.md ?? size.sm ?? size.default
  } else if (innerWidth >= breakpoint.xl &&  innerWidth < breakpoint.xl2) {
    return size.xl2 ?? size.xl ?? size.lg ?? size.md ?? size.sm ?? size.default
  } else {
    return size.default
  }
}

export const snackbarInfo = 'this is a global message info'
