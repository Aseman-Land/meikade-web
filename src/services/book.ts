/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import axios from "axios";
import { globalHandleError } from "../layouts/mainframe";
import { API } from "../models/api";
import { MkAddBook, MkBook, MkBookResult, MkEditBook, MkGetBooksRequest } from "../models/book";
import { MkFullBookResult, MkFullContent, MkGetTopRequest } from "../models/content";
import request from "../utils/axios";

export namespace MkBookServices {

    export const all = async (query: MkGetBooksRequest): Promise<API<Array<MkBookResult>>> => {
        try {
            const res = await request.get<API<Array<MkBookResult>>>(`/v4/book/all`, {params: query});
            const resData: API<Array<MkBookResult>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on all");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkBookResult>>>(e) && e.response) {
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


    export const deleteBook = async (book_id: number): Promise<API<boolean>> => {
        try {
            const res = await request.delete<API<boolean>>(`/v4/book/${book_id}`);
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on deleteBook");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "deleteBook failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const downloadBook = async (book_id: number): Promise<API<any>> => {
        try {
            const res = await request.get<API<any>>(`/v4/book/${book_id}/download`);
            const resData: API<any> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on downloadBook");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<any>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "downloadBook failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const edit = async (book_id: number, input: MkEditBook): Promise<API<MkBook>> => {
        try {
            const res = await request.patch<API<MkBook>>(`/v4/book/${book_id}`, input);
            const resData: API<MkBook> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on edit");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkBook>>(e) && e.response) {
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


    export const getBookContents = async (book_id: number): Promise<API<Array<MkFullContent>>> => {
        try {
            const res = await request.get<API<Array<MkFullContent>>>(`/v4/book/${book_id}/contents`);
            const resData: API<Array<MkFullContent>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getBookContents");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkFullContent>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getBookContents failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getOneBook = async (book_id: number): Promise<API<MkFullBookResult>> => {
        try {
            const res = await request.get<API<MkFullBookResult>>(`/v4/book/${book_id}`);
            const resData: API<MkFullBookResult> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getOneBook");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkFullBookResult>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getOneBook failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const insert = async (input: MkAddBook): Promise<API<MkBook>> => {
        try {
            const res = await request.post<API<MkBook>>(`/v4/book`, input);
            const resData: API<MkBook> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on insert");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkBook>>(e) && e.response) {
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


    export const topRated = async (query: MkGetTopRequest): Promise<API<Array<MkBookResult>>> => {
        try {
            const res = await request.get<API<Array<MkBookResult>>>(`/v4/book/top/by-rate`, {params: query});
            const resData: API<Array<MkBookResult>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on topRated");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkBookResult>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "topRated failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const topViewed = async (query: MkGetTopRequest): Promise<API<Array<MkBookResult>>> => {
        try {
            const res = await request.get<API<Array<MkBookResult>>>(`/v4/book/top/by-view`, {params: query});
            const resData: API<Array<MkBookResult>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on topViewed");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkBookResult>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "topViewed failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };
}
