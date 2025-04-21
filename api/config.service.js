let BASE_URL = ''
let MSG_HUB_URL = ''
if (import.meta.env.DEV) {
  BASE_URL = `http://localhost:16416/api`
  //  #ifdef H5
  BASE_URL = `http://localhost:16416/api`
  //  #endif
  MSG_HUB_URL = BASE_URL
} else {
  BASE_URL = 'http://localhost:16416/api'
  MSG_HUB_URL = BASE_URL
  //  #ifdef H5
  BASE_URL = 'http://localhost:16416/api'
  MSG_HUB_URL = 'http://localhost:16416/api'
  //  #endif
}
const configService = {
  apiUrl: BASE_URL,
  msgHubUrl: MSG_HUB_URL
}

export default configService
