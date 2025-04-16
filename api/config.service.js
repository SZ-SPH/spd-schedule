let BASE_URL = ''
let MSG_HUB_URL = ''
if (import.meta.env.DEV) {
  BASE_URL = `http://39.107.78.98:6049/api`
  //  #ifdef H5
  BASE_URL = `http://39.107.78.98:6049/api`
  //  #endif
  MSG_HUB_URL = BASE_URL
} else {
  BASE_URL = 'http://39.107.78.98:6049/api'
  MSG_HUB_URL = BASE_URL
  //  #ifdef H5
  BASE_URL = 'http://39.107.78.98:6049/api'
  MSG_HUB_URL = 'http://39.107.78.98:6049/api'
  //  #endif
}
const configService = {
  apiUrl: BASE_URL,
  msgHubUrl: MSG_HUB_URL
}

export default configService
