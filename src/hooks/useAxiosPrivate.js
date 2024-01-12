import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

//! what this hook will do is attach accessToken in the header and refresh if expired
const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    //& we get access to the request and response before it send to the api so we are going to check if it has the token or not
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = "Bearer " + auth?.accessToken;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    //& if the response is okay we just return the response, but otherwise we will have an error handler
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        //? 1) get the previous request
        //? 2) check if the status is 403
        //? 3) we will set a custom property on the request to check if it doesnt as we want to retry once
        //? 4) get a new access token by calling the refresh function
        //? 5) access the previous request and get into the header and set the token
        //? 6) Finally after setting the access token in there we need to return by passing axios instance with the previousRequest NOW we are making the request again
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
