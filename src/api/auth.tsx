import axios from "axios"
import Endpoints from "./endpoints.tsx";

export const setTokens = (access_token: string, refresh_token: string) => {
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
}

export const getTokens = (): { access_token: string | null, refresh_token: string | null } => {
    return {
        access_token: localStorage.getItem("access_token"),
        refresh_token: localStorage.getItem("refresh_token")
    }
}

const refreshTokens = async () => {
    const tokens = getTokens();
    if (tokens.refresh_token === null) {
        console.log("banana1")
        window.location.href = "/auth/signin"
        return;
    }

    try {
        const response = await axios.get(Endpoints.AUTH_REFRESH, {
            params: {
                token: tokens.refresh_token
            }
        })

        const [access_token, refresh_token] = response.data.response;

        setTokens(access_token, refresh_token);
        return;
    } catch {
        console.log("banana2")
        window.location.href = "/auth/signin"
        return;
    }

}

export type UserType = {
    _id: number,
    email: string,
    domain: string | null,
    password_hash: string,
    first_name: string,
    last_name: string,
    mid_name: string | null,
    roles: string[]
}

export const getCurrentUser = async (): Promise<UserType | undefined> => {
    let tokens = getTokens();
    if (tokens.access_token === null || tokens.refresh_token === null) {
        return undefined;
    }

    const tryGetUser = async (access_token: string): Promise<UserType | undefined | "expired"> => {
        var response: {test: any} = {
            test: undefined
        }
        try {
            response.test = await axios.get(Endpoints.USERS_GET_CURRENT, {
                params: {
                    token: access_token
                }
            });
            return response.test.data.response;
        } catch (e) {
            if (response.test != undefined) {
                if (response.test.status === "TOKEN_EXPIRED") {
                    return "expired"
                }
            }
            return undefined;
        }
    }

    let first_user = await tryGetUser(tokens.access_token);
    if (first_user == undefined) {
        return undefined;
    }

    if (first_user == "expired") {
        await refreshTokens();
        tokens = getTokens();
        if (tokens.access_token === null) {

            return undefined;
        }
        first_user = await tryGetUser(tokens.access_token);

        if (first_user == "expired" || first_user === null) {
            return undefined;
        }
    }
    return first_user;
}

export const getWithToken = async (path: string, query: any) => {
    const current_user = await getCurrentUser();

    if (current_user === undefined) {
        window.location.href = "/auth/signin";
        return;
    }

    const tokens = getTokens();

    try {
        return await axios.get(path, {
            params: {
                ...query,
                token: tokens.access_token
            }
        });
    } catch {
        return undefined;
    }
}

export const postWithToken = async (path: string, query: any) => {
    const current_user = await getCurrentUser();

    if (current_user === undefined) {
        window.location.href = "/auth/signin";
        return;
    }

    const tokens = getTokens();

    try {
        return await axios.post(path, {
            ...query,
            token: tokens.access_token
        }, {
            params: {
                ...query,
                token: tokens.access_token
            }
        });
    } catch (e) {
        return undefined;
    }
}