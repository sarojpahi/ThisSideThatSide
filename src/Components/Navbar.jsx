import dynamic from "next/dynamic";
import Link from "next/link";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);
const Navbar = () => {
  return (
    <div className="flex justify-between w-full items-center h-14 border-gray-200 border-b-2 px-4">
      <div className="text-red-500">Logo</div>
      <Link href={"/Bets"}>
        <div className="text-red-700 tracking-wider transition-all duration-150">
          Your Bets
        </div>
      </Link>
      <div>
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
