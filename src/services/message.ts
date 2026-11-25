/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import axios from "axios";
import { globalHandleError } from "../layouts/mainframe";
import { API } from "../models/api";
import { MkMessage } from "../models/message";
import request from "../utils/axios";

export namespace MkMessageServices {

    export const getMessages = async (): Promise<API<Array<MkMessage>>> => {
        try {
            const res = await request.get<API<Array<MkMessage>>>(`/v4/message`);
            const resData: API<Array<MkMessage>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getMessages");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkMessage>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getMessages failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };
}
