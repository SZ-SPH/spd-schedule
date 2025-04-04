import request from '@/utils/request'
import {
  formdataify
} from '@/plugins/format'
import configService from '@/api/config.service'

export function listSchedulebook(data) {
  return new Promise((resolve, reject) => {
    fetch(`${configService.apiUrl}/DeptApplyPlan/GetSurgicalScheduling`,{
      method:"POST",
      body: formdataify(data)
    }).then(res => {
      resolve(res.json())
    })
  })
}
