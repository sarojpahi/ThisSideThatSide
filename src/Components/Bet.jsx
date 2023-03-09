import { AuthContext } from "@/context/AuthContext";
import React, { useContext, useState } from "react";
const style = {
  btn: "cursor-pointer w-max px-4 py-2 flex justify-center item-center border-2 text-center rounded-lg hover:scale-110 text-2xl leading-none transition duration-200",
};
const Bet = ({ topic, side }) => {
  const [amount, setAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const { connected } = useContext(AuthContext);

  const handleSubmit = () => {
    if (amount >= 0.1 && amount <= 100) {
      setTotal((prev) => prev + amount);
      setAmount(0);
      alert("Bet successfully placed");
    } else if (amount < 0.1) alert("Minimum bet should be 0.1 sol");
    else alert("Maximum bet should be 100 sol");
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
              Place Bet
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
