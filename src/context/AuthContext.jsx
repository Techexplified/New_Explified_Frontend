import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../network/axiosInstance";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("api/new/auth/profile");
      setAuth(res.data.data);
      console.log({ res });
    } catch (err) {
      console.log({ err });
      setAuth(null);
      // console.log(err?.response?.data?.message || err.message);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.get("api/new/auth/logout");
      setAuth(null);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext used outside of provider.");
  return context;
}

export default AuthProvider;
