/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import axios from "axios";
import { globalHandleError } from "../layouts/mainframe";
import { API } from "../models/api";
import request from "../utils/axios";

export namespace MkActivityServices {

    export const checkIn = async (content_id: number): Promise<API<boolean>> => {
        try {
            const res = await request.post<API<boolean>>(`/v4/activity/contents/${content_id}/checkin`);
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on checkIn");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "checkIn failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const submit = async (content_id: number): Promise<API<boolean>> => {
        try {
            const res = await request.post<API<boolean>>(`/v4/activity/contents/${content_id}/submit`);
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on submit");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "submit failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };
}
