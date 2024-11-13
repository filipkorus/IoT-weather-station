import { apiPathBase } from "@/config/constants";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseQuery = fetchBaseQuery({
    baseUrl: apiPathBase,
    credentials: "include", // send cookies with cross-origin requests
});
