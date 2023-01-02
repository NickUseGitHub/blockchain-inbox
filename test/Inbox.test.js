const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../compile");

const INITIAL_MESSAGE = "Hi there!";
let accounts;
let inbox;

beforeEach(async function () {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: [INITIAL_MESSAGE],
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", function () {
  it("deploys a contract", function () {
    assert.ok(inbox.options.address);
  });

  it("has a default message", async function () {
    const msg = await inbox.methods.message().call();

    assert.equal(msg, INITIAL_MESSAGE);
  });

  it("can change message", async function () {
    const changedMessage = "bye";

    await inbox.methods.setMessage(changedMessage).send({ from: accounts[0] });

    const msg = await inbox.methods.message().call();

    assert.equal(msg, changedMessage);
  });
});
