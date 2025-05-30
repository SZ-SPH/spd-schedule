import request from '@/utils/request'
import routers from '@/json/routers'

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  if (typeof(dictType) === "object") {
    return request({
      url: '/system/dict/data/dicts',
      data: dictType,
      method: 'POST'
    })
  } else {
    return request({
      url: '/system/dict/data/type/' + dictType,
      method: 'get'
    })
  }
}

/**
 * 获取banner
 * @param {Object} query
 */
export function getBanners(query) {
  return request({
    url: '/public/BannerConfig/bannerList',
    method: 'get',
    data: query
  })
}

/**
 * 用户系统消息分页查询
 * @param {查询条件} data
 */
export function listMySysUserMsg(query) {
  return request({
    url: '/SysUserMsg/mylist',
    method: 'get',
    data: query
  })
}
/**
 * 查询未读消息数
 * @param {Object} query
 */
export function queryUnReadMsgNum(query) {
  return request({
    url: '/SysUserMsg/myMsgNum',
    method: 'get',
    data: query
  })
}

/**
 * 已读用户系统消息
 * @param data
 */
export function readSysUserMsg(msgId, msgType) {
  return request({
    url: '/SysUserMsg/read/' + msgId + '/' + msgType,
    method: 'post'
  })
}
/**
 * 获取工作台路由
 */
export function getRouters() {
  return new Promise((resolve) => { // 模拟异步请求，返回 Promise
    setTimeout(() => { // 模拟延迟
      resolve(routers); // 模拟 request 函数返回的数据结构
    }, 10); // 模拟 500ms 延迟
  });
}
