import axiosInstance from './instance'

const sendGetAllEventRequest = () => {
  const web = axiosInstance()
  return web.get<unknown>(`/api/v1/event`)
}

export const sendDeleteEventRequest = (id: string) => {
  const web = axiosInstance()
  return web.delete<unknown>(`/api/v1/event/${id}`)
}

export const sendAddEventRequest = (param: object) => {
  const web = axiosInstance();
  return web.post(`/api/v1/event`, param);
};

export const sendApproveEventRequest = (id: string, confirmedDate: string) => {
  const web = axiosInstance();
  return web.post(`/api/v1/event/approve/${id}`, { confirmedDate });
};

export const sendRejectEventRequest = (id: string, reason: string) => {
  const web = axiosInstance();
  return web.post(`/api/v1/event/reject/${id}`, { reason });
};

export default sendGetAllEventRequest
