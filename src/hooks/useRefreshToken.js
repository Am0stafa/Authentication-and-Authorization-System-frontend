import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  //* we will call this function when our initial request fails OR on refresh to persist the user

  const refresh = async () => {
    const response = await axios.get("/refresh", {
      withCredentials: true,
    });

    setAuth({
      user: response.data.user,
      roles: response.data.roles,
      accessToken: response.data.accessToken,
      name: response?.data?.name,
    });

    return response.data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
