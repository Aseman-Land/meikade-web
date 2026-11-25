/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import axios from "axios";
import { globalHandleError } from "../layouts/mainframe";
import { API } from "../models/api";
import { MkBootstrap } from "../models/bootstrap";
import { MkGetAppDetailsRequest } from "../models/general";
import request from "../utils/axios";

export namespace MkBootstrapServices {

    export const get = async (query: MkGetAppDetailsRequest): Promise<API<MkBootstrap>> => {
        try {
            const res = await request.get<API<MkBootstrap>>(`/v4/bootstrap`, {params: query});
            const resData: API<MkBootstrap> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on get");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkBootstrap>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "get failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };
}
