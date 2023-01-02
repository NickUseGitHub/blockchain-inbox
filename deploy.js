require("dotenv").config();

const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("./compile");

const provider = new HDWalletProvider(
  process.env.NMENOMIC_WORDS,
  process.env.MAINNET_URL
);

const web3 = new Web3(provider);

const deploy = async function () {
  const accounts = await web3.eth.getAccounts();

  const INITIAL_MESSAGE = "Hi there!";

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [INITIAL_MESSAGE] })
    .send({ gas: "1000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};

deploy().catch((err) => {
  console.error(err);

  provider.engine.stop();
});
