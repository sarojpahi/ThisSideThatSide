import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { toast } from "react-toastify";
import axios from "axios";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const Navbar = () => {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const getUserTokenBalance = async (publicKey, connection) => {
    try {
      const mintToken = new PublicKey(
        "jbD4P2CMyxYanaCGykdDiEJ1fvFtYFAE3A8oWXcWstC"
      );

      const associatedTokenFrom = await getAssociatedTokenAddress(
        mintToken,
        publicKey
      );
      const fromAccount = await getAccount(connection, associatedTokenFrom);
      const balance = +fromAccount.amount.toString() / LAMPORTS_PER_SOL;
      setBalance(balance);
    } catch (e) {
      console.log(`error getting balance: `, e);
    }
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

  const handleAirdrop = async () => {
    setLoading(true);
    try {
      if (connected) {
        const res = await axios.post(`/api/mint`, {
          user_pubkey: publicKey.toString(),
          amount: 10,
        });
        toast("Airdrop 10 leaf successfully");
      }
      getUserTokenBalance();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

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
      {publicKey && balance <= 0 && (
        <div
          onClick={handleAirdrop}
          className=" bg-green-600 transition-all duration-300 hover:tracking-wider font-semibold justify-between w-[250px] cursor-pointer border p-2 rounded-lg"
        >
          <div className="flex flex-col justify-center items-center w-full">
            <p className=" text-gray-50">{loading ? "Dropping" : "Airdrop"}</p>
          </div>
        </div>
      )}
      <div className="flex items-center">
        {connected && (
          <div>
            <span className="font-semibold">Balance</span>: {balance} leaf
          </div>
        )}
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
