/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import axios from "axios";
import { globalHandleError } from "../layouts/mainframe";
import { API } from "../models/api";
import { MkForgetRequest, MkSignInByCode, MkSignInByPhoneResult, MkSignInGetCodeBySMS, MkSignInGetCodeBySMSResult, MkSignInResult } from "../models/auth";
import { MkSignIn, MkUserNew, MkUserPrivate } from "../models/user";
import request from "../utils/axios";

export namespace MkAuthServices {

    export const check = async (): Promise<API<boolean>> => {
        try {
            const res = await request.get<API<boolean>>(`/v4/auth/check`);
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on check");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
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


    export const forget = async (username_or_email: string): Promise<API<string>> => {
        try {
            const res = await request.get<API<string>>(`/v4/auth/forget/${username_or_email}`);
            const resData: API<string> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on forget");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<string>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "forget failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const forgetLogin = async (input: MkForgetRequest): Promise<API<MkSignInResult>> => {
        try {
            const res = await request.post<API<MkSignInResult>>(`/v4/auth/forget`, input);
            const resData: API<MkSignInResult> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on forgetLogin");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkSignInResult>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "forgetLogin failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getCodeBySMS = async (input: MkSignInGetCodeBySMS): Promise<API<MkSignInGetCodeBySMSResult>> => {
        try {
            const res = await request.post<API<MkSignInGetCodeBySMSResult>>(`/v4/auth/code`, input);
            const resData: API<MkSignInGetCodeBySMSResult> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getCodeBySMS");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkSignInGetCodeBySMSResult>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getCodeBySMS failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const signIn = async (input: MkSignIn): Promise<API<MkSignInResult>> => {
        try {
            const res = await request.post<API<MkSignInResult>>(`/v4/auth`, input);
            const resData: API<MkSignInResult> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on signIn");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkSignInResult>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "signIn failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const signInUsingCode = async (input: MkSignInByCode): Promise<API<MkSignInByPhoneResult>> => {
        try {
            const res = await request.post<API<MkSignInByPhoneResult>>(`/v4/auth/code/submit`, input);
            const resData: API<MkSignInByPhoneResult> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on signInUsingCode");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkSignInByPhoneResult>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "signInUsingCode failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const signUp = async (input: MkUserNew): Promise<API<MkUserPrivate>> => {
        try {
            const res = await request.post<API<MkUserPrivate>>(`/v4/auth/register`, input);
            const resData: API<MkUserPrivate> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on signUp");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkUserPrivate>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "signUp failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };
}
