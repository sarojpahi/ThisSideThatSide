import { useWallet } from "@solana/wallet-adapter-react";

import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const wallet = useWallet();
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    if (wallet.connected) setConnected(true);
  }, [wallet.connecting]);
  const value = {
    connected,
    wallet,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
