/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import axios from "axios";
import { globalHandleError } from "../layouts/mainframe";
import { MkAchievement, MkAchievementProgress, MkUserAchievement } from "../models/achievement";
import { API } from "../models/api";
import request from "../utils/axios";

export namespace MkAchievementServices {

    export const getAchievements = async (): Promise<API<Array<MkAchievement>>> => {
        try {
            const res = await request.get<API<Array<MkAchievement>>>(`/v4/achievement`);
            const resData: API<Array<MkAchievement>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getAchievements");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkAchievement>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getAchievements failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getAchievementsProgresses = async (): Promise<API<Array<MkAchievementProgress>>> => {
        try {
            const res = await request.get<API<Array<MkAchievementProgress>>>(`/v4/achievement/me/progress`);
            const resData: API<Array<MkAchievementProgress>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getAchievementsProgresses");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkAchievementProgress>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getAchievementsProgresses failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getMyAchievements = async (): Promise<API<Array<MkUserAchievement>>> => {
        try {
            const res = await request.get<API<Array<MkUserAchievement>>>(`/v4/achievement/me`);
            const resData: API<Array<MkUserAchievement>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getMyAchievements");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkUserAchievement>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getMyAchievements failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getUserAchievements = async (user_id: number): Promise<API<Array<MkUserAchievement>>> => {
        try {
            const res = await request.get<API<Array<MkUserAchievement>>>(`/v4/achievement/${user_id}`);
            const resData: API<Array<MkUserAchievement>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getUserAchievements");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkUserAchievement>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getUserAchievements failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };
}
