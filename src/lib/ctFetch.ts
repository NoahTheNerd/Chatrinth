import FetchConfig from "./FetchConfig";
import axios, { type AxiosRequestConfig } from 'axios';

export default function ctFetch(endpoint : string, config : AxiosRequestConfig = FetchConfig) {
    return axios.get('https://corsproxy.io/?'+encodeURI('https://chattriggers.com/api/'+endpoint), config)
}

export function ctPost(endpoint : string, data : any, config : AxiosRequestConfig = {}) {
    return axios.post('https://corsproxy.io/?'+encodeURI('https://chattriggers.com/api/'+endpoint), data, config)
}