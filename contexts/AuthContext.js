import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/Supabase"; // Adjust the path if needed
import { getUserData } from "../services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log('session user: ', session?.user?.id);

      if (session?.user) {
        setUser(session.user);
        updateUserData(session?.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const updateUserData = async (user) => {
    let res = await getUserData(user?.id);
    
    if (res.success) {
      console.log('Fetched user data:', res.data);
      setUserData(res.data);
    } else {
      console.error('Error fetching user data:', res.error);
    }
  };

  const setAuth = (authUser) => {
    setUser(authUser);
  };

  const setUserData = (userData) => {
    setUser((prevUser) => {
      const updatedUser = {
        ...prevUser,
        ...userData,
      };

      console.log('Updated user:', updatedUser); 
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, setAuth, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
