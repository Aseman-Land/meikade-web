/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import axios from "axios";
import { globalHandleError } from "../layouts/mainframe";
import { API } from "../models/api";
import { MkExplore } from "../models/explore";
import { MkGetGeneralRequest } from "../models/general";
import request from "../utils/axios";

export namespace MkExploreServices {

    export const getExplore = async (query: MkGetGeneralRequest): Promise<API<MkExplore>> => {
        try {
            const res = await request.get<API<MkExplore>>(`/v4/explore`, {params: query});
            const resData: API<MkExplore> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getExplore");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkExplore>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getExplore failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getIntelligenceExplore = async (query: MkGetGeneralRequest): Promise<API<MkExplore>> => {
        try {
            const res = await request.get<API<MkExplore>>(`/v4/explore/intelligence`, {params: query});
            const resData: API<MkExplore> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getIntelligenceExplore");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkExplore>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getIntelligenceExplore failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };
}
