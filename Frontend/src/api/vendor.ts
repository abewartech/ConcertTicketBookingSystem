import axiosInstance from './instance'

const sendGetAllVendorRequest = () => {
  const web = axiosInstance()
  return web.get<unknown>(`/api/v1/vendor`)
}

export default sendGetAllVendorRequest
