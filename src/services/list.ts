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
import { MkAddList, MkAppendListReq, MkAppendVerseListReq, MkEditList, MkFullListResult, MkGetListsRequest, MkListContent, MkListContentVerse, MkListResult } from "../models/list";
import request from "../utils/axios";

export namespace MkListServices {

    export const all = async (query: MkGetListsRequest): Promise<API<Array<MkListResult>>> => {
        try {
            const res = await request.get<API<Array<MkListResult>>>(`/v4/list/all`, {params: query});
            const resData: API<Array<MkListResult>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on all");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkListResult>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "all failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const append = async (list_id: number, input: MkAppendListReq): Promise<API<boolean>> => {
        try {
            const res = await request.post<API<boolean>>(`/v4/list/${list_id}/contents`, input);
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on append");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "append failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const appendVerse = async (list_id: number, input: MkAppendVerseListReq): Promise<API<boolean>> => {
        try {
            const res = await request.post<API<boolean>>(`/v4/list/${list_id}/verses`, input);
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on appendVerse");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "appendVerse failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const deleteList = async (list_id: number): Promise<API<boolean>> => {
        try {
            const res = await request.delete<API<boolean>>(`/v4/list/${list_id}`);
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on deleteList");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "deleteList failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const edit = async (list_id: number, input: MkEditList): Promise<API<MkFullListResult>> => {
        try {
            const res = await request.patch<API<MkFullListResult>>(`/v4/list/${list_id}`, input);
            const resData: API<MkFullListResult> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on edit");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkFullListResult>>(e) && e.response) {
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


    export const getListContents = async (list_id: number, query: MkGetGeneralRequest): Promise<API<Array<MkListContent>>> => {
        try {
            const res = await request.get<API<Array<MkListContent>>>(`/v4/list/${list_id}/contents`, {params: query});
            const resData: API<Array<MkListContent>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getListContents");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkListContent>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getListContents failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getListVerses = async (list_id: number, query: MkGetGeneralRequest): Promise<API<Array<MkListContentVerse>>> => {
        try {
            const res = await request.get<API<Array<MkListContentVerse>>>(`/v4/list/${list_id}/verses`, {params: query});
            const resData: API<Array<MkListContentVerse>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getListVerses");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkListContentVerse>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getListVerses failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getOneList = async (list_id: number): Promise<API<MkFullListResult>> => {
        try {
            const res = await request.get<API<MkFullListResult>>(`/v4/list/${list_id}`);
            const resData: API<MkFullListResult> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getOneList");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkFullListResult>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getOneList failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const insert = async (input: MkAddList): Promise<API<MkFullListResult>> => {
        try {
            const res = await request.post<API<MkFullListResult>>(`/v4/list`, input);
            const resData: API<MkFullListResult> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on insert");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkFullListResult>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "insert failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const myLists = async (query: MkGetListsRequest): Promise<API<Array<MkListResult>>> => {
        try {
            const res = await request.get<API<Array<MkListResult>>>(`/v4/list`, {params: query});
            const resData: API<Array<MkListResult>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on myLists");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkListResult>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "myLists failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const remove = async (list_id: number, content_id: number): Promise<API<boolean>> => {
        try {
            const res = await request.delete<API<boolean>>(`/v4/list/${list_id}/contents/${content_id}`);
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on remove");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "remove failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const removeVerse = async (list_id: number, verse_id: number): Promise<API<boolean>> => {
        try {
            const res = await request.delete<API<boolean>>(`/v4/list/${list_id}/verses/${verse_id}`);
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on removeVerse");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "removeVerse failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };
}
