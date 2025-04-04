import request from '@/utils/request'
import {
  formdataify
} from '@/plugins/format'
import configService from '@/api/config.service'

// 查询列表
export function listRoombookList(data) {
  return new Promise((resolve, reject) => {
    fetch(`${configService.apiUrl}/DeptApplyPlan/GetNaxtDayApplyPlanMain`,{
      method:"POST",
      body: formdataify(data)
    }).then(res => {
      resolve(res.json())
    })
  })
}

//查询模板
export function listRoomBookTemplate(data) {
  return new Promise((resolve, reject) => {
    fetch(`${configService.apiUrl}/DeptApplyPlan/GetNaxtDayApplyPlanTemp`,{
      method:"POST",
      body: formdataify(data)
    }).then(res => {
      resolve(res.json())
    })
  })
}


//查询模板下的条目
export function listRoomBookTemplateDetail(data) {
  return new Promise((resolve, reject) => {
    fetch(`${configService.apiUrl}/DeptApplyPlan/GetNaxtDayApplyPlanDelTemp`,{
      method:"POST",
      body: formdataify(data)
    }).then(res => {
      resolve(res.json())
    })
  })
}

//模板创建申请单
export function generateNaxtDayOrder(data) {
  return new Promise((resolve, reject) => {
    fetch(`${configService.apiUrl}/DeptApplyPlan/AddNaxtDayApplyPlanMainApp`,{
      method:"POST",
      body: formdataify(data)
    }).then(res => {
      resolve(res.json())
    })
  })
}

//手术排期创建申请
export function generateNaxtDayOrderNormal(data) {
  return new Promise((resolve, reject) => {
    fetch(`${configService.apiUrl}/DeptApplyPlan/AddNaxtDayApplyPlanMain`,{
      method:"POST",
      body: formdataify(data)
    }).then(res => {
      resolve(res.json())
    })
  })
}

//查询创建单下面的条目
export function listNaxtItemDetail(data) {
  return new Promise((resolve, reject) => {
    fetch(`${configService.apiUrl}/DeptApplyPlan/GetNaxtDayApplyPlanDel`,{
      method:"POST",
      body: formdataify(data)
    }).then(res => {
      resolve(res.json())
    })
  })
}

//自定义新增
export function SerachAuthVar(data) {
  const params = new URLSearchParams(data);
  return new Promise((resolve, reject) => {
    fetch(`${configService.apiUrl}/DeptApplyPlan/SerachAuthVar?${params.toString()}`,{
      method:"GET"
    }).then(res => {
      resolve(res.json())
    })
  })
}

//删除申请单
export function deleteNaxtDayOrder(data) {
  return new Promise((resolve, reject) => {
    fetch(`${configService.apiUrl}/DeptApplyPlan/DelNaxtDayApplyPlanMain`,{
      method:"POST",
      body: formdataify(data)
    }).then(res => {
      resolve(res.json())
    })
  })
}

//提交申请单
export function submitNaxtDayOrder(data) {
  return new Promise((resolve, reject) => {
    fetch(`${configService.apiUrl}/DeptApplyPlan/upNaxtDayApplyPlanMainByState`,{
      method:"POST",
      body: formdataify(data)
    }).then(res => {
      resolve(res.json())
    })
  })
}

//获取院区
export function listStorage(data) {
  return new Promise((resolve, reject) => {
    // 1. 构建 URLSearchParams 对象
    const params = new URLSearchParams(data);

    // 2. 构建完整的 URL，将查询参数拼接到 URL 后面
    const url = `${configService.apiUrl}/Commons/GetStorageList?${params.toString()}`;

    // 3. 使用 fetch 发送 GET 请求 (不再需要 body)
    fetch(url, {
      method: "GET",
      // GET 请求通常不需要设置 Content-Type，除非 API 有特殊要求
      // 如果 API 要求 Content-Type: application/json，则可以添加 headers
      // headers: {
      //   'Content-Type': 'application/json'
      // }
    })
    .then(response => {
      if (!response.ok) { // 检查响应状态码
        return reject(new Error(`HTTP error! status: ${response.status}`)); // 抛出错误，reject Promise
      }
      return response.json(); // 解析 JSON 响应体
    })
    .then(jsonData => {
      resolve(jsonData); // 成功解析 JSON 后 resolve Promise
    })
    .catch(error => {
      reject(error); // 捕获 fetch 错误或 JSON 解析错误，reject Promise
    });
  });
}

