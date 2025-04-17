import request from '@/utils/request'
import {
  formdataify
} from '@/plugins/format'
import configService from '@/api/config.service'

export function listSchedulebook(data) {
  return new Promise((resolve, reject) => {
    request({
      url:`/DeptApplyPlan/GetSurgicalScheduling`,
      method:`POST`,
      data:data,
      header:{
        "Content-Type" : "application/x-www-form-urlencoded"
      }
    }).then(res => {
      resolve(res)
    }).catch(err=>{
      reject(err)
    })

  })
}
