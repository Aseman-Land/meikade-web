
import axios, { AxiosError, AxiosResponse, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
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

export const baseUrl: string = 'https://api.meikade.com';
export const apiUrl: string = baseUrl + '/api';

const axiosInstance = axios.create({
    baseURL: apiUrl,
})

const cookies = new Cookies();


export const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (!config.headers.getContentType())
        config.headers.setContentType("application/json; charset=utf-8");
    const currentRegisterToken = cookies.get('register_token');
    const currentSessionToken = cookies.get('session_token');
    if (currentSessionToken)
        config.headers.setAuthorization(currentSessionToken);
    else if (currentRegisterToken)
        config.headers.setAuthorization(currentRegisterToken);
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
