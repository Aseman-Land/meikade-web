/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import axios from "axios";
import { globalHandleError } from "../layouts/mainframe";
import { API } from "../models/api";
import { MkFullContent } from "../models/content";
import { MkGetTypesRequest, MkType } from "../models/type";
import request from "../utils/axios";

export namespace MkTypeServices {

    export const getContentsOfType = async (type_id: number, query: MkGetTypesRequest): Promise<API<Array<MkFullContent>>> => {
        try {
            const res = await request.get<API<Array<MkFullContent>>>(`/v4/type/${type_id}/contents`, {params: query});
            const resData: API<Array<MkFullContent>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getContentsOfType");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkFullContent>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getContentsOfType failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getTypes = async (): Promise<API<Array<MkType>>> => {
        try {
            const res = await request.get<API<Array<MkType>>>(`/v4/type`);
            const resData: API<Array<MkType>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getTypes");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkType>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getTypes failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };
}
