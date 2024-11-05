import { API } from "../models/api";
import { Poet } from "../models/poet";
import request from "../utils/axios";

export const getPoets = async (): Promise<Poet[]> => {
    const response = await request.get<API<Poet[]>>('/main/poets/simple');
    return response.data.result;
}
