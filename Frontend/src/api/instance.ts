/* eslint-disable no-console */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import useAuthStore from '@/stores/authStore'

const axiosInstance = () => {
  const { token } = useAuthStore.getState()
  axios.defaults.headers.post['Content-Type'] = 'application/json'
  axios.defaults.headers.post.Accept = 'application/json'
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_AUTH_API_BASE_URL,
    timeout: 60000,
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return instance
}

export default axiosInstance
