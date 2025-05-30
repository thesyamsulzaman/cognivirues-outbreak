import axios from "axios";
import { create } from "apisauce";
import JSCookie from "js-cookie";

export const api = () => {
  const COOKIE_TOKEN = import.meta.env.VITE_COOKIE_TOKEN || "";
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  const authCookie = JSCookie.get(COOKIE_TOKEN) || getCookie(COOKIE_TOKEN);
  const baseApi = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
      Authorization: `Bearer ${authCookie}`,
    },
  });

  return create({
    baseURL: BASE_URL,
    axiosInstance: baseApi,
    timeout: 20000,
  });
};

export const getCookie = (name: string) => {
  return JSCookie.get(name);
};

export const setCookie = (name: string, value: string) => {
  JSCookie.set(name, value, {
    domain: import.meta.env.VITE_COOKIE_DOMAIN,
    expires: 365 * 100,
  });
};

export const removeCookie = (name: string) => {
  JSCookie.remove(name, {
    domain: import.meta.env.VITE_COOKIE_DOMAIN,
  });
};
