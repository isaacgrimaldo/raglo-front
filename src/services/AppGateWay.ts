import axios from 'axios'

export const AppGateWay = axios.create({
    baseURL: import.meta.env.VITE_APP_API
})