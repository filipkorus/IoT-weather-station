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
    // decode the JWT to check if it's expired
    const token = localStorage.getItem("token");
    if (token) {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired) {
            console.log("Token expired, attempting to refresh...");
            const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

            if (refreshResult.data) {
                // store the new token
                const newToken = (refreshResult.data as RefreshResponse).token;
                localStorage.setItem("token", newToken);
                console.log("Token refreshed successfully.");

                // update headers with new token
                args.headers = {
                    ...args.headers,
                    authorization: `Bearer ${newToken}`,
                };
            } else {
                console.log("Failed to refresh token, logging out...");
                localStorage.removeItem("token");
                window.location.href = "/login";
                return { error: { status: 401, data: "Token refresh failed" } };
            }
        }
    }

    // proceed with the original request
    return await baseQuery(args, api, extraOptions);
};
