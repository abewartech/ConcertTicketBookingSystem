import axiosInstance from './instance'

const sendGetAllUserRequest = () => {
  const web = axiosInstance()
  return web.get<unknown>(`/api/v1/user`)
}

export const sendDeleteUserRequest = (id: string) => {
  const web = axiosInstance()
  return web.delete<unknown>(`/api/v1/user/${id}`)
}

export default sendGetAllUserRequest
