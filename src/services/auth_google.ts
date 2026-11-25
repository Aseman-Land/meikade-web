/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import axios from "axios";
import { globalHandleError } from "../layouts/mainframe";
import { API } from "../models/api";
import { MkOAuthCheckRequest, MkOAuthCheckResult, MkOAuthConnectRequest, MkOAuthRegisterRedirectResult, MkOAuthRegisterResult } from "../models/auth";
import request from "../utils/axios";

export namespace MkGoogleServices {

    export const check = async (query: MkOAuthCheckRequest): Promise<API<MkOAuthCheckResult>> => {
        try {
            const res = await request.get<API<MkOAuthCheckResult>>(`/v4/google/check`, {params: query});
            const resData: API<MkOAuthCheckResult> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on check");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkOAuthCheckResult>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "check failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const connect = async (input: MkOAuthConnectRequest): Promise<API<boolean>> => {
        try {
            const res = await request.post<API<boolean>>(`/v4/google/connect`, input);
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on connect");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "connect failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const redirect = async (query: MkOAuthRegisterRedirectResult): Promise<API<boolean>> => {
        try {
            const res = await request.get<API<boolean>>(`/v4/google/redirect`, {params: query});
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on redirect");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "redirect failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const registerAccount = async (): Promise<API<MkOAuthRegisterResult>> => {
        try {
            const res = await request.get<API<MkOAuthRegisterResult>>(`/v4/google`);
            const resData: API<MkOAuthRegisterResult> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on registerAccount");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkOAuthRegisterResult>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "registerAccount failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };
}
