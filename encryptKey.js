const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function main() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  const encryptedJsonKey = await wallet.encrypt(
    "password",
    process.env.PRIVATE_KEY
  );
  fs.writeFileSync(
    "./.encryptedKey-Testnet-Goerli.json",
    encryptedJsonKey,
    "utf8"
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => console.log(err));
