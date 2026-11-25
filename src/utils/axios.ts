
import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Cookies } from "react-cookie";

export interface ResponseMessage<T> {
    message: string,
    data: T
}

export interface ResponseErrorMessage {
    timestamp: string
    status: number
    error: string
    message: string
    path: string
}

export const baseUrlWs: string = import.meta.env.DEV ? 'ws://185.213.164.44/mk' : (window.location.origin.indexOf('dev.meikade.com') < 0 ? window.location.origin : window.location.origin + '/mk').replaceAll('https://', 'wss://');
export const apiUrlWs: string = baseUrlWs + '/api';

export const baseUrl: string = import.meta.env.DEV ? 'http://185.213.164.44/mk' : window.location.origin.indexOf('dev.meikade.com') < 0 ? window.location.origin : window.location.origin + '/mk';
export const apiUrl: string = baseUrl + '/api';

export const storageBaseUrl: string = baseUrl + '/api/v4';

axios.defaults.timeout = 120000;
const axiosInstance = axios.create({
    baseURL: apiUrl,
})

const cookies = new Cookies();


export const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // config.headers.setContentType("application/json; charset=utf-8");

    config.headers.set("App-Secret-ID", "tapp_5575d0484665ad506a310f3ab4287574b28e0b074d32de33ba445e6781df7d7c");
    config.headers.set("App-Version", "1");

    const currentSessionToken = cookies.get('token');
    if (currentSessionToken)
        config.headers.setAuthorization('Bearer ' + currentSessionToken);

    return config;
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    console.error(`[request error] [${JSON.stringify(error)}]`);
    return Promise.reject(error);
}

const onResponse = (response: AxiosResponse<ResponseMessage<any>>): AxiosResponse => {
    return response;
}

const onResponseError = (error: AxiosError<ResponseMessage<any>>): Promise<AxiosError> => {
    return Promise.reject(error);
}

export function setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
    axiosInstance.interceptors.request.use(onRequest, onRequestError);
    axiosInstance.interceptors.response.use(onResponse, onResponseError);
    return axiosInstance;
}

export default setupInterceptorsTo(axiosInstance)
