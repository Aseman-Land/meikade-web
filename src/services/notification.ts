/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import axios from "axios";
import { globalHandleError } from "../layouts/mainframe";
import { API } from "../models/api";
import { MkGetGeneralRequest } from "../models/general";
import { MkFullNotification } from "../models/notification";
import request from "../utils/axios";

export namespace MkNotificationServices {

    export const getMyNotifications = async (query: MkGetGeneralRequest): Promise<API<Array<MkFullNotification>>> => {
        try {
            const res = await request.get<API<Array<MkFullNotification>>>(`/v4/notification/all`, {params: query});
            const resData: API<Array<MkFullNotification>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getMyNotifications");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkFullNotification>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getMyNotifications failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const seenAllNotifications = async (): Promise<API<boolean>> => {
        try {
            const res = await request.post<API<boolean>>(`/v4/notification/seen`);
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on seenAllNotifications");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "seenAllNotifications failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };
}
