import { apiPathBase } from "@/config/constants";
import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

interface RefreshResponse {
    token: string;
}

interface BaseQueryWithReauthArgs extends FetchArgs {
    // include additional fields if necessary
}

const baseQuery = fetchBaseQuery({
    baseUrl: apiPathBase,
    credentials: "include", // send cookies with cross-origin requests
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export const baseQueryWithReauth: BaseQueryFn<BaseQueryWithReauthArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions,
) => {
    let result = await baseQuery(args, api, extraOptions);

    // check for 401 Unauthorized
    if (result.error && result.error.status === 401) {
        // attempt to refresh token
        const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

        if (refreshResult.data) {
            // store the new token
            const token = (refreshResult.data as RefreshResponse).token;
            localStorage.setItem("token", token);

            // retry the original request
            result = await baseQuery(args, api, extraOptions);
        } else {
            // handle refresh failure (e.g., logout user)
            window?.location.replace("/login");
        }
    }

    return result;
};
