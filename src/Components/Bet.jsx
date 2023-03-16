import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { handlePayment } from "./Transfer";
const style = {
  btn: "cursor-pointer w-max px-4 py-2 flex justify-center item-center border-2 text-center rounded-lg hover:scale-110 text-2xl leading-none transition duration-200",
};
const toastStyle = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};
const Bet = ({ topicData, side }) => {
  const { topic, total_bet } = topicData;
  const [amount, setAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const { connection } = useConnection();
  const { publicKey, connected, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const postBet = async (amount) => {
    try {
      await axios.post("/api/bet", {
        bet_by: publicKey.toString(),
        bet_to_topic: topic["_id"]["$oid"],
        bet_amount: amount,
        bet_on_side: side ? "a" : "b",
      });
      setTotal((prev) => prev + amount);
      setAmount(0);
      inputRef.current.value = 0;
      toast("Bet successfully Placed");
    } catch (error) {
      toast(error);
    }
  };

  const handleSubmit = async () => {
    if (connected) {
      if (amount >= 1 && amount <= 100) {
        setLoading(true);
        const sign = await handlePayment(
          amount,
          connection,
          publicKey,
          signTransaction
        );
        if (sign) {
          await postBet(amount);
          toast(
            <a
              target={"_blank"}
              href={
                "https://explorer.solana.com/tx/" + sign + `?cluster=devnet`
              }
              className={"truncate"}
            >
              Tran ID : <span className="font-semibold underline">{sign}</span>
            </a>,
            toastStyle
          );
        }
        setLoading(false);
      } else if (amount < 1) toast("Minimum bet should be 1 leaf", toastStyle);
      else toast("Maximum bet should be 100 leaf", toastStyle);
    } else toast("Wallet not connected", toastStyle);
  };

  return (
    <>
      {topic && (
        <div
          className={`flex ${
            !side ? "flex-row-reverse" : ""
          } justify-center items-center gap-2`}
        >
          <div className="flex flex-col items-center p-8 border-cyan-200 rounded-lg border-2 w-full">
            <div>{topic.topic_name}</div>
            <div>Bet Amount : {amount} sol</div>
            <div>Total Bet Amount : {total} sol</div>
            <div className="flex gap-4 mt-4">
              <div className=" w-max bg-[#dedede] h-full rounded-lg ">
                <input
                  className="outline-none min-w-base bg-[#dedede] px-4 py-2 rounded-lg"
                  type="text"
                  ref={inputRef}
                  onInput={(e) => {
                    setAmount(+e.target.value);
                  }}
                />
                <span className=" w-max h-full bg-[#dedede] py-2 pr-4 rounded-lg">
                  sol
                </span>
              </div>
            </div>
            <div className={`${style.btn} mt-4`} onClick={handleSubmit}>
              {!loading ? "Place Bet" : "Placing Bet"}
            </div>
          </div>
          <div className="displayText uppercase font-semibold text-yellow-900">
            {side ? "This Side" : "That Side"}
          </div>
        </div>
      )}
    </>
  );
};

export default Bet;
