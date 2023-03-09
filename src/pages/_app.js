import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import Navbar from "@/Components/Navbar";
import "@/styles/globals.css";
import { useEffect, useMemo, useState } from "react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { AuthProvider } from "@/context/AuthContext";
require("@solana/wallet-adapter-react-ui/styles.css");
export default function App({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AuthProvider>
            {mounted && (
              <div className="min-h-screen bg-gray-100">
                <Navbar />
                <Component {...pageProps} />
              </div>
            )}
          </AuthProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
