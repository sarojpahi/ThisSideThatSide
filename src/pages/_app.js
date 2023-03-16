import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import Navbar from "@/Components/Navbar";
import "@/styles/globals.css";
import { Suspense, useEffect, useMemo, useState } from "react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";
require("@solana/wallet-adapter-react-ui/styles.css");
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const env = process.env.NODE_ENV;
if (env == "development") {
  console.log("env", env, process.env.NEXT_PUBLIC_DEV_BASE_URL);
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_DEV_BASE_URL;
} else if (env == "production") {
}

const Loading = () => {
  return <h2>Loading...</h2>;
};

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
                <ToastContainer />
                <Navbar />
                <Suspense fallback={Loading}>
                  <Component {...pageProps} />
                </Suspense>
              </div>
            )}
          </AuthProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
