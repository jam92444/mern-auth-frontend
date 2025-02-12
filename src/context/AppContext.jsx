import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  //get user data
  const getUserdata = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data");
      data.success ? setUserData(data.userData) : toast.error(data.message);
      console.log(data.userData);
    } catch (error) {
      toast.error(error.message);
    }
  };

  //getting authentication status
  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/auth/is-auth");

      if (data.success) {
        setIsLoggedIn(true);
        getUserdata();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserdata,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
