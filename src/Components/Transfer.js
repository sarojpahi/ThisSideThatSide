import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import {
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  getAccount,
} from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";

export const configureAndSendCurrentTransaction = async (
  transaction,
  connection,
  feePayer,
  signTransaction
) => {
  const blockHash = await connection.getLatestBlockhash();
  transaction.feePayer = feePayer;
  transaction.recentBlockhash = blockHash.blockhash;
  const signed = await signTransaction(transaction);
  const signature = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction({
    blockhash: blockHash.blockhash,
    lastValidBlockHeight: blockHash.lastValidBlockHeight,
    signature,
  });
  return signature;
};

export const handlePayment = async (
  amount,
  connection,
  publicKey,
  signTransaction
) => {
  try {
    if (!publicKey || !signTransaction) {
      throw new WalletNotConnectedError();
    }
    const mintToken = new PublicKey(
      "jbD4P2CMyxYanaCGykdDiEJ1fvFtYFAE3A8oWXcWstC"
    );
    const recipientAddress = new PublicKey(
      "BNxr3hZ55T3Bvxh4rHNhbbadZ3ATk7r3TpXnMP9bcPoh"
    );

    const transactionInstructions = [];
    const associatedTokenFrom = await getAssociatedTokenAddress(
      mintToken,
      publicKey
    );
    const fromAccount = await getAccount(connection, associatedTokenFrom);
    const associatedTokenTo = await getAssociatedTokenAddress(
      mintToken,
      recipientAddress
    );
    if (!(await connection.getAccountInfo(associatedTokenTo))) {
      transactionInstructions.push(
        createAssociatedTokenAccountInstruction(
          publicKey,
          associatedTokenTo,
          recipientAddress,
          mintToken
        )
      );
    }
    transactionInstructions.push(
      createTransferInstruction(
        fromAccount.address,
        associatedTokenTo,
        publicKey,
        1000000000 * amount
      )
    );
    const transaction = new Transaction().add(...transactionInstructions);
    const signature = await configureAndSendCurrentTransaction(
      transaction,
      connection,
      publicKey,
      signTransaction
    );
    return signature;
  } catch (error) {
    alert(error);
    console.log(error);
  }
};
