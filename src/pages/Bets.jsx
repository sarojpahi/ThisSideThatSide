import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Bets = () => {
  const [bets, setBets] = useState();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const fetchBets = async (key) => {
    try {
      setLoading(true);
      const res = await axios.post(`/api/allbets`, { key });
      const betData = res.data.reverse();
      setBets(betData);
    } catch (error) {
      console.log("Fetch error", error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (publicKey) fetchBets(publicKey.toString());
  }, [publicKey]);
  return (
    <div>
      {loading && <h2>Loading</h2>}
      {bets && bets.length !== 0 && (
        <div className="lg:p-4 p-2">
          <div className="w-full m-auto lg:p-4 p-2 border rounded-lg bg-white">
            <div className="my-3 p-2 grid md:grid-cols-5 sm:grid-cols-3 grid-cols-2 items-center gap-5 justify-between cursor-default">
              <span className="whitespace-nowrap ">Topic ID</span>
              <span className="text-center hidden lg:grid">Bet ID</span>
              <span className="text-center">Status</span>
              <span className="text-center ">Bet Side</span>
              <span className="text-center">Amount</span>
            </div>
            <ul>
              {bets.map((el) => (
                <div
                  key={el["_id"]["$oid"]}
                  className="bg-gray-50 h-14 hover:bg-gray-100 rounded-lg p-2 my-3 grid  md:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-5 items-center justify-between"
                >
                  <Link href={`topic/${el.bet_to_topic["$oid"]}`}>
                    <p className="truncate linkAnimate">
                      {el.bet_to_topic["$oid"]}
                    </p>
                  </Link>
                  <p className="text-center hidden lg:grid ml-5 w-max">
                    {el["_id"]["$oid"]}
                  </p>
                  <p className="truncate text-center">
                    {el.bet_is_running ? "Ongoing" : "Completed"}
                  </p>
                  <p className="truncate text-center uppercase italic">
                    {el.bet_on_side == "a" ? "This Side" : "That Side"}
                  </p>
                  <p className="text-center">{el.bet_amount} sol</p>
                </div>
              ))}
            </ul>
          </div>
        </div>
      )}
      {bets && bets.length === 0 && (
        <div className="lg:col-span-2 col-span-1 bg-white justify-between mx-auto border p-2 lg:p-4 rounded-lg w-[98%]">
          No Bets Found
        </div>
      )}
    </div>
  );
};

export default Bets;
