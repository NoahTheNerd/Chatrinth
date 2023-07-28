import axios from "axios"
export default function proxyGet(url : string) {
    return axios.get('https://corsproxy.io/?'+encodeURI(url))
}