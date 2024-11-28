export const removeAccessTokenIfObsolete = () => {
    // decode the JWT to check if it's expired
    const token = localStorage.getItem("token");
    if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        if (isExpired) {
            localStorage.removeItem("token");
        }
    }
};
