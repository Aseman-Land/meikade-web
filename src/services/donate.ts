/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import axios from "axios";
import { globalHandleError } from "../layouts/mainframe";
import { API } from "../models/api";
import { MkAddDonate, MkDonate } from "../models/donate";
import request from "../utils/axios";

export namespace MkDonateServices {

    export const addDonate = async (input: MkAddDonate): Promise<API<boolean>> => {
        try {
            const res = await request.post<API<boolean>>(`/v4/donate`, input);
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on addDonate");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "addDonate failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getDonates = async (): Promise<API<Array<MkDonate>>> => {
        try {
            const res = await request.get<API<Array<MkDonate>>>(`/v4/donate`);
            const resData: API<Array<MkDonate>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getDonates");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkDonate>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getDonates failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };
}
