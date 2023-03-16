import { useWallet } from "@solana/wallet-adapter-react";

import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const wallet = useWallet();
  const [key, setKey] = useState("");
  useEffect(() => {
    if (wallet.connected) setKey(wallet.publicKey.toString());
    else setKey("");
  }, [wallet.connected, wallet.publicKey]);
  const value = {
    key,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
