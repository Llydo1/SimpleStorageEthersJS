const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
const bin = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8");

const getWallet = async () => {
  for await (const password of readline) {
    return await new ethers.Wallet.fromEncryptedJson(
      fs.readFileSync(process.env.KEY_GANACHE, "utf8"),
      password
    )
      .then((resp) => {
        console.log("Login successfully");
        return resp;
      })
      .catch(() => false);
  }
};

async function main() {
  console.log("Enter your password of your wallet JSON file: ");
  let wallet = await getWallet();
  if (wallet === false) {
    console.log("Wrong password");
  } else {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.RPC_URL_GANACHE
    );
    wallet = await wallet.connect(provider);

    contractFactory = new ethers.ContractFactory(abi, bin, wallet);
    console.log("Deploying, please wait...");
    const contract = await contractFactory.deploy();
    await contract.deployTransaction.wait(1);
    console.log(`Contract Address: ${contract.address}`);

    let currentFavoriteNumber = await contract.retrieve();
    console.log(`Current favorite Number: ${currentFavoriteNumber}`);
    const transactionResponse = await contract.store("12312335123515");
    await transactionResponse.wait(1);
    currentFavoriteNumber = await contract.retrieve();
    console.log(`Update favoraite number: ${currentFavoriteNumber}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => console.log(err));
