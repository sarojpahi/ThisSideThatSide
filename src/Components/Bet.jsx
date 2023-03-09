import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import React, { useContext, useState } from "react";
const style = {
  btn: "cursor-pointer w-max px-4 py-2 flex justify-center item-center border-2 text-center rounded-lg hover:scale-110 text-2xl leading-none transition duration-200",
};
const Bet = ({ topic, side }) => {
  const [amount, setAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const { connected, wallet } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const postBet = (amount) => {
    setLoading(true);
    axios
      .post("/api/bet", {
        bet_by: wallet.publicKey.toString(),
        bet_to_topic: topic["_id"]["$oid"],
        bet_amount: amount,
        bet_on_side: side ? "a" : "b",
      })
      .then(() => {
        alert("Bet successfully Placed");
        setTotal((prev) => prev + amount);
      })
      .catch((e) => alert(e))
      .finally(() => {
        setLoading(false);
        setAmount(0);
      });
  };

  const handleSubmit = () => {
    if (connected) {
      if (amount >= 0.1 && amount <= 100) {
        postBet(amount);
      } else if (amount < 0.1) alert("Minimum bet should be 0.1 sol");
      else alert("Maximum bet should be 100 sol");
    } else alert("Wallet not connected");
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
