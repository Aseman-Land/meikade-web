/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import axios from "axios";
import { globalHandleError } from "../layouts/mainframe";
import { API } from "../models/api";
import { MkCheckCodeRequest, MkCheckInviteCodeResult, MkFullInvitation } from "../models/invitations";
import request from "../utils/axios";

export namespace MkInvitationsServices {

    export const check = async (query: MkCheckCodeRequest): Promise<API<MkCheckInviteCodeResult>> => {
        try {
            const res = await request.get<API<MkCheckInviteCodeResult>>(`/v4/invitations/check`, {params: query});
            const resData: API<MkCheckInviteCodeResult> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on check");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkCheckInviteCodeResult>>(e) && e.response) {
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


    export const getMyCode = async (): Promise<API<MkFullInvitation>> => {
        try {
            const res = await request.get<API<MkFullInvitation>>(`/v4/invitations`);
            const resData: API<MkFullInvitation> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getMyCode");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkFullInvitation>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getMyCode failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };
}
