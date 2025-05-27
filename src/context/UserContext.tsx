import type React from 'react';
import { createContext, useContext, useState } from 'react';

interface UserContextType {
  userDoc: any;
  setUserDoc: (doc: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userDoc, setUserDoc] = useState<any>(null);

  return (
    <UserContext.Provider value={{ userDoc, setUserDoc }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};