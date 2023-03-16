import { handlePayment } from "@/Components/Transfer";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

axios.defaults.baseURL = "http://localhost:3001";
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

const TopicID = ({ topicData, betData }) => {
  const { topic } = topicData;
  const [total, setTotal] = useState(topicData.total_bet);
  const [amount, setAmount] = useState(0);
  const [side, setSide] = useState("");
  const { connection } = useConnection();
  const { publicKey, connected, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const postBet = async () => {
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
      console.log(error);
      toast(error.message);
    }
  };

  const handleSubmit = async () => {
    if (connected) {
      if (side === "") {
        return toast("Select Side", {
          position: "top-center",
        });
      }
      if (amount < 1)
        return toast("Minimum Bet Amount is 1 leaf", {
          position: "top-center",
        });
      if (amount > 100)
        return toast("Maximum Bet Amount is 100 leaf", {
          position: "top-center",
        });
      try {
        setLoading(true);
        const sign = await handlePayment(
          amount,
          connection,
          publicKey,
          signTransaction
        );
        if (sign) {
          await postBet();
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
        fetchData();
      } catch (error) {
        toast.error(error);
      } finally {
        setLoading(false);
      }
    } else toast("Wallet not connected", toastStyle);
  };

  const fetchData = () => {
    axios
      .get(`/api/topic/${params.id}`)
      .then((res) => setAmount(res.data.total_bet))
      .catch((e) => console.log(e));
  };

  return (
    <div className="flex flex-col justify-center items-center mt-6">
      {topic && (
        <div
          className={`flex ${
            !side ? "flex-row-reverse" : ""
          } justify-center items-center gap-2`}
        >
          <div className="flex flex-col items-center p-8 border-cyan-200 rounded-lg border-2 w-full">
            <div className="font-semibold text-3xl pb-2">
              {topic.topic_name}
            </div>
            <div>Total Bet Amount : {total} leaf</div>
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
                  leaf
                </span>
              </div>
              <div className=" w-max bg-[#dedede] h-full rounded-lg ">
                <select
                  defaultValue={""}
                  className="outline-none min-w-base bg-[#dedede] px-4 py-2 rounded-lg cursor-pointer"
                  onChange={(e) => setSide(e.target.value)}
                >
                  <option value="" disabled hidden>
                    Select Side
                  </option>
                  <option value="a">This Side</option>
                  <option value="b">That Side</option>
                </select>
              </div>
            </div>
            <div className={`${style.btn} mt-4`} onClick={handleSubmit}>
              {!loading ? "Place Bet" : "Placing Bet"}
            </div>
          </div>
          {/* <div className="displayText uppercase font-semibold text-yellow-900">
            {side ? "This Side" : "That Side"}
          </div> */}
        </div>
      )}
      {betData?.length != 0 ? (
        <div className="lg:p-4 p-2">
          <div className="w-full m-auto lg:p-4 p-2 border rounded-lg bg-white ">
            <div className="my-3 font-bold text-xl p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center gap-5 justify-between cursor-default">
              <span className="whitespace-nowrap ">Bet ID</span>
              <span className="text-center ">Bet By</span>
              <span className="text-center">Bet Side</span>
              <span className="text-center">Amount</span>
            </div>
            <ul>
              {betData?.map(
                (el, i) =>
                  i < 5 && (
                    <li
                      key={el["_id"]["$oid"]}
                      className="bg-gray-50 hover:bg-gray-100 rounded-lg p-2 my-3 grid  md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-5 items-center justify-between cursor-pointer"
                    >
                      <p className="truncate">{el["_id"]["$oid"]}</p>
                      <p className="truncate text-center">{el.bet_by}</p>
                      <p className="truncate text-center uppercase italic">
                        {el.bet_on_side == "a" ? "This Side" : "That Side"}
                      </p>
                      <p className="text-center">{el.bet_amount} sol</p>
                    </li>
                  )
              )}
            </ul>
          </div>
        </div>
      ) : (
        <h2>No Bets Found</h2>
      )}
    </div>
  );
};

export default TopicID;

export async function getServerSideProps({ params }) {
  const res1 = await axios.get(`/api/topic/${params.id}`);
  const topicData = res1.data;

  const res2 = await axios.get(`/api/bet/${params.id}`);
  const betData = res2.data.reverse();
  return {
    props: { topicData, betData },
  };
}
