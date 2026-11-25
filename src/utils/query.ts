import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import req from "./axios";

export function useFetch<T>(url:string,config?:AxiosRequestConfig){
  return useQuery({
    queryKey: [url,config?.params],
    queryFn: async() => await req.get<T>(url,config),
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    select: data => data.data,
  });
}

export function useSubmit<T>(url:string,config?:AxiosRequestConfig) {
  return useMutation({
    mutationKey:[url,config?.params],
    mutationFn: async () => await req.post<T>(url,config),
  })
}

export function useRequest<T>(config?:AxiosRequestConfig) {
  return useMutation({
    mutationKey:[config?.url,config?.params],
    mutationFn: async () => await req.request<T>({...config}),
  })
}