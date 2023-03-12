import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const Navbar = () => {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(0);

  const getUserTokenBalance = async (publicKey, connection) => {
    let balance = 0;
    try {
      const mintToken = new PublicKey(
        "jbD4P2CMyxYanaCGykdDiEJ1fvFtYFAE3A8oWXcWstC"
      );

      const associatedTokenFrom = await getAssociatedTokenAddress(
        mintToken,
        publicKey
      );
      const fromAccount = await getAccount(connection, associatedTokenFrom);
      balance = +fromAccount.amount.toString() / LAMPORTS_PER_SOL;
    } catch (e) {
      console.log(`error getting balance: `, e);
    }
    setBalance(balance);
  };

  useEffect(() => {
    if (publicKey) {
      getUserTokenBalance(publicKey, connection);
      const onUpdateBalance = () => {
        getUserTokenBalance(publicKey, connection);
      };
      connection.onAccountChange(publicKey, onUpdateBalance);
      return () => {
        connection.removeAccountChangeListener(publicKey, onUpdateBalance);
      };
    }
  }, [connected, publicKey]);

  return (
    <div className="flex justify-between w-full items-center h-14 border-gray-200 border-b-2 px-4">
      <Link href={"/"}>
        <div className="text-red-500">Logo</div>
      </Link>
      <Link href={"/Bets"}>
        <div className="text-red-700 tracking-wider transition-all duration-150">
          Your Bets
        </div>
      </Link>

      <div className="flex items-center">
        <div>
          <span className="font-semibold">Balance</span>: {balance} leaf
        </div>
        <WalletMultiButtonDynamic
          style={{
            padding: "10px 20px",
            color: "black",
            background: "transparent",
          }}
        />
      </div>
    </div>
  );
};

export default Navbar;
