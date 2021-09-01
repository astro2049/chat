import axios from "axios";

const { REACT_APP_SERVER_ADDRESS } = process.env;

export function signInOrOut(url, params) {
    return axios.post(REACT_APP_SERVER_ADDRESS + url, { ...params });
}
