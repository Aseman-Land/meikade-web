/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import axios from "axios";
import { globalHandleError } from "../layouts/mainframe";
import { API } from "../models/api";
import { MkCreateChat, MkFullChat } from "../models/chat";
import { MkCreateMessage, MkEditMessage, MkFullChatMessage } from "../models/chatmessage";
import { MkGetGeneralRequest } from "../models/general";
import request from "../utils/axios";

export namespace MkChatServices {

    export const chats = async (query: MkGetGeneralRequest): Promise<API<Array<MkFullChat>>> => {
        try {
            const res = await request.get<API<Array<MkFullChat>>>(`/v4/chat`, {params: query});
            const resData: API<Array<MkFullChat>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on chats");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkFullChat>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "chats failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const createChat = async (input: MkCreateChat): Promise<API<MkFullChat>> => {
        try {
            const res = await request.post<API<MkFullChat>>(`/v4/chat`, input);
            const resData: API<MkFullChat> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on createChat");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkFullChat>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "createChat failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const deleteChat = async (chat_id_str: string): Promise<API<boolean>> => {
        try {
            const res = await request.delete<API<boolean>>(`/v4/chat/${chat_id_str}`);
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on deleteChat");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "deleteChat failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const deleteMessage = async (chat_id_str: string, message_id: number): Promise<API<boolean>> => {
        try {
            const res = await request.delete<API<boolean>>(`/v4/chat/${chat_id_str}/messages/${message_id}`);
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on deleteMessage");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "deleteMessage failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const editMessage = async (chat_id_str: string, message_id: number, input: MkEditMessage): Promise<API<MkFullChatMessage>> => {
        try {
            const res = await request.patch<API<MkFullChatMessage>>(`/v4/chat/${chat_id_str}/messages/${message_id}`, input);
            const resData: API<MkFullChatMessage> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on editMessage");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkFullChatMessage>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "editMessage failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getChat = async (chat_id_str: string): Promise<API<MkFullChat>> => {
        try {
            const res = await request.get<API<MkFullChat>>(`/v4/chat/${chat_id_str}`);
            const resData: API<MkFullChat> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getChat");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkFullChat>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getChat failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getMessages = async (chat_id_str: string, query: MkGetGeneralRequest): Promise<API<Array<MkFullChatMessage>>> => {
        try {
            const res = await request.get<API<Array<MkFullChatMessage>>>(`/v4/chat/${chat_id_str}/messages`, {params: query});
            const resData: API<Array<MkFullChatMessage>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getMessages");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkFullChatMessage>>>(e) && e.response) {
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


    export const sendMessages = async (chat_id_str: string, input: MkCreateMessage): Promise<API<MkFullChatMessage>> => {
        try {
            const res = await request.post<API<MkFullChatMessage>>(`/v4/chat/${chat_id_str}/messages`, input);
            const resData: API<MkFullChatMessage> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on sendMessages");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkFullChatMessage>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "sendMessages failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };
}
