/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import axios from "axios";
import { globalHandleError } from "../layouts/mainframe";
import { API, Upload } from "../models/api";
import { MkBookResult, MkGetBooksRequest, MkMyUserWithBooks, MkUserWithBooks } from "../models/book";
import { MkGetGeneralRequest } from "../models/general";
import { MkConfigs, MkFollowUserRequest, MkFullUser, MkFullUserActivity, MkSearchUsersRequest, MkUser, MkUserAuthenticate, MkUserUpdate } from "../models/user";
import request from "../utils/axios";

export namespace MkUserServices {

    export const booksOfUser = async (user_id: number, query: MkGetBooksRequest): Promise<API<Array<MkBookResult>>> => {
        try {
            const res = await request.get<API<Array<MkBookResult>>>(`/v4/user/${user_id}/books`, {params: query});
            const resData: API<Array<MkBookResult>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on booksOfUser");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkBookResult>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "booksOfUser failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const checkEmail = async (email: string): Promise<API<boolean>> => {
        try {
            const res = await request.get<API<boolean>>(`/v4/user/check/email/${email}`);
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on checkEmail");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "checkEmail failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const checkUsername = async (username: string): Promise<API<boolean>> => {
        try {
            const res = await request.get<API<boolean>>(`/v4/user/check/username/${username}`);
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on checkUsername");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "checkUsername failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const configs = async (): Promise<API<MkConfigs>> => {
        try {
            const res = await request.get<API<MkConfigs>>(`/v4/user/configs`);
            const resData: API<MkConfigs> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on configs");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkConfigs>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "configs failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const deleteMe = async (input: MkUserAuthenticate): Promise<API<number>> => {
        try {
            const res = await request.delete<API<number>>(`/v4/user/me`, {data: input});
            const resData: API<number> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on deleteMe");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<number>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "deleteMe failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const downloadUser = async (user_id: number): Promise<API<any>> => {
        try {
            const res = await request.delete<API<any>>(`/v4/user/${user_id}`);
            const resData: API<any> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on downloadUser");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<any>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "downloadUser failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const edit = async (input: MkUserUpdate): Promise<API<MkUser>> => {
        try {
            const res = await request.patch<API<MkUser>>(`/v4/user/me`, input);
            const resData: API<MkUser> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on edit");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkUser>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "edit failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const follow = async (input: MkFollowUserRequest): Promise<API<boolean>> => {
        try {
            const res = await request.post<API<boolean>>(`/v4/user/me/followings`, input);
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on follow");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "follow failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const followers = async (): Promise<API<Array<MkFullUser>>> => {
        try {
            const res = await request.get<API<Array<MkFullUser>>>(`/v4/user/me/followers`);
            const resData: API<Array<MkFullUser>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on followers");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkFullUser>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "followers failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const followersOfUser = async (user_id: number): Promise<API<Array<MkFullUser>>> => {
        try {
            const res = await request.get<API<Array<MkFullUser>>>(`/v4/user/${user_id}/followers`);
            const resData: API<Array<MkFullUser>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on followersOfUser");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkFullUser>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "followersOfUser failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const followings = async (): Promise<API<Array<MkFullUser>>> => {
        try {
            const res = await request.get<API<Array<MkFullUser>>>(`/v4/user/me/followings`);
            const resData: API<Array<MkFullUser>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on followings");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkFullUser>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "followings failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const followingsOfUser = async (user_id: number): Promise<API<Array<MkFullUser>>> => {
        try {
            const res = await request.get<API<Array<MkFullUser>>>(`/v4/user/${user_id}/followings`);
            const resData: API<Array<MkFullUser>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on followingsOfUser");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkFullUser>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "followingsOfUser failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getUser = async (user_id: string): Promise<API<MkUserWithBooks>> => {
        try {
            const res = await request.get<API<MkUserWithBooks>>(`/v4/user/${user_id}`);
            const resData: API<MkUserWithBooks> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getUser");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkUserWithBooks>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getUser failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getUserActivities = async (user_id: number): Promise<API<MkFullUserActivity>> => {
        try {
            const res = await request.get<API<MkFullUserActivity>>(`/v4/user/${user_id}/activities`);
            const resData: API<MkFullUserActivity> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getUserActivities");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkFullUserActivity>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getUserActivities failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const logout = async (): Promise<API<boolean>> => {
        try {
            const res = await request.post<API<boolean>>(`/v4/user/logout`);
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on logout");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "logout failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const me = async (): Promise<API<MkMyUserWithBooks>> => {
        try {
            const res = await request.get<API<MkMyUserWithBooks>>(`/v4/user/me`);
            const resData: API<MkMyUserWithBooks> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on me");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkMyUserWithBooks>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "me failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const myBooks = async (query: MkGetBooksRequest): Promise<API<Array<MkBookResult>>> => {
        try {
            const res = await request.get<API<Array<MkBookResult>>>(`/v4/user/me/books`, {params: query});
            const resData: API<Array<MkBookResult>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on myBooks");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkBookResult>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "myBooks failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const search = async (query: MkSearchUsersRequest): Promise<API<Array<MkFullUser>>> => {
        try {
            const res = await request.get<API<Array<MkFullUser>>>(`/v4/user/search`, {params: query});
            const resData: API<Array<MkFullUser>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on search");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkFullUser>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "search failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const topRated = async (query: MkGetGeneralRequest): Promise<API<Array<MkFullUser>>> => {
        try {
            const res = await request.get<API<Array<MkFullUser>>>(`/v4/user/top/by-rate`, {params: query});
            const resData: API<Array<MkFullUser>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on topRated");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkFullUser>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "topRated failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const topViewed = async (query: MkGetGeneralRequest): Promise<API<Array<MkFullUser>>> => {
        try {
            const res = await request.get<API<Array<MkFullUser>>>(`/v4/user/top/by-view`, {params: query});
            const resData: API<Array<MkFullUser>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on topViewed");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkFullUser>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "topViewed failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const unfollow = async (user_id: number): Promise<API<boolean>> => {
        try {
            const res = await request.delete<API<boolean>>(`/v4/user/me/followings/${user_id}`);
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on unfollow");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "unfollow failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const unsetAvatar = async (user_id: number): Promise<API<MkUserWithBooks>> => {
        try {
            const res = await request.delete<API<MkUserWithBooks>>(`/v4/user/${user_id}/avatar`);
            const resData: API<MkUserWithBooks> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on unsetAvatar");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkUserWithBooks>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "unsetAvatar failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const unsetMyAvatar = async (): Promise<API<MkUserWithBooks>> => {
        try {
            const res = await request.delete<API<MkUserWithBooks>>(`/v4/user/me/avatar`);
            const resData: API<MkUserWithBooks> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on unsetMyAvatar");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkUserWithBooks>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "unsetMyAvatar failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const updateAvatar = async (user_id: number, avatar: Upload): Promise<API<MkUserWithBooks>> => {
        try {
            const formData = new FormData();
            if (avatar.file)
                formData.append("avatar", avatar.file);
            else if (avatar.blob)
                formData.append("avatar", avatar.blob.data, avatar.blob.filename);
            else
                throw false;
            const res = await request.post<API<MkUserWithBooks>>(`/v4/user/${user_id}/avatar`, formData);
            const resData: API<MkUserWithBooks> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on updateAvatar");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkUserWithBooks>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "updateAvatar failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const updateConfigs = async (input: MkConfigs): Promise<API<boolean>> => {
        try {
            const res = await request.patch<API<boolean>>(`/v4/user/configs`, input);
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on updateConfigs");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "updateConfigs failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const updateMyAvatar = async (avatar: Upload): Promise<API<MkUserWithBooks>> => {
        try {
            const formData = new FormData();
            if (avatar.file)
                formData.append("avatar", avatar.file);
            else if (avatar.blob)
                formData.append("avatar", avatar.blob.data, avatar.blob.filename);
            else
                throw false;
            const res = await request.post<API<MkUserWithBooks>>(`/v4/user/me/avatar`, formData);
            const resData: API<MkUserWithBooks> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on updateMyAvatar");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkUserWithBooks>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "updateMyAvatar failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };
}
