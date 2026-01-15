import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { setTokenGetter } from "../lib/axios";

export default function AxiosProvider({ children }) {
  const { getToken } = useAuth();

  useEffect(() => {
    // Set the token getter function for axios interceptor
    setTokenGetter(getToken);
    
    return () => {
      setTokenGetter(null);
    };
  }, [getToken]);

  return children;
}
