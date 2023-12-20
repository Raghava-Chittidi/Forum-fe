import { selectorStateType } from "../types/types";
import { authActions } from "../store/index";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";

const useAuthorise = () => {
    const TOKEN_EXPIRY_TIME = 15 * 60 * 1000;
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state: selectorStateType) => state.auth.isLoggedIn);
    const [loading, setLoading] = useState<boolean>(true);

    const sendRequest = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/refresh`, {
                withCredentials: true,
            });
            const { AccessToken, RefreshToken, Email, Username } = res.data;
            dispatch(
                authActions.login({
                    tokenPair: { access_token: AccessToken, refresh_token: RefreshToken },
                    userData: { email: Email, username: Username },
                }),
            );
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.log(err);
        }
    };

    useEffect(() => {
        if (!isLoggedIn) {
            sendRequest();
        }

        // Timer to check when access token expires
        else {
            const i = setInterval(() => {
                sendRequest();
            }, TOKEN_EXPIRY_TIME);

            setLoading(false);
            return () => clearInterval(i);
        }
    }, [isLoggedIn]);

    return loading;
};

export default useAuthorise;
