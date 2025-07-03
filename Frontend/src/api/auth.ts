import { ILoginFormValue } from '@/models/auth'
import axiosInstance from '@/api/instance'

const sendLoginRequest = (param: ILoginFormValue) => {
  const ai = axiosInstance()
  return ai.post('/auth/login', param)
}

export default sendLoginRequest
