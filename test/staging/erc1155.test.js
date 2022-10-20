const erc1155 = artifacts.require("tokens");
const truffleAssert = require("truffle-assertions");
require("web3");
const chainID = config.network_id;
const { testingConfig } = require("../../helper-truffle-config.js");

(chainID != 5777 ? contract : contract.skip)(
  "CrowdSale Testnet",
  async function (accounts) {
    before(async () => {
      instance = await erc1155.deployed();
    });

    it("Deployed succesfully", async () => {
      assert(instance.address != "", "contract deployed incorrectly");
    });

    it("Can't mint without payment", async () => {
      truffleAssert.reverts(
        instance.mint.sendTransaction(1, 1),
        "Insufficient amount", "minted without payment "
      );
    });
    it("Mint token", async () => {
      await new Promise((resolve, reject) => {
        instance.mint
          .sendTransaction(1, 1, { from: accounts[0], value: "1" })
          .on("confirmation", function (confNumber, receipt, latestBlockHash) {
            if (confNumber > testingConfig.blockConfirmation) resolve();
            else console.log(confNumber);
          });
      });

      await instance
        .balanceOf(accounts[0], 1)
        .then((x) => assert(x.toString() == 1, "token creation failed"));
    });

    it("Can't mint more than supply", async () => {
      await truffleAssert.reverts(
        instance.mint(
          2,
          2,
          { from: accounts[0], value: "2" }),
          "Cant mint given amount of tokens", "minted more than supplys"
        
      );
    });

    it("Batch mint", async () => {
      await new Promise((resolve, reject) => {
        instance.mintBatch
          .sendTransaction([2, 3, 7, 9], [1, 1, 50, 60], { value: "172" })
          .on("confirmation", function (confNumber, receipt, latestBlockHash) {
            if (confNumber > testingConfig.blockConfirmation) resolve();
            else console.log(confNumber);
          });
      });

      await instance.balanceOfBatch
        .call(
          [accounts[0], accounts[0], accounts[0], accounts[0]],
          [2, 3, 7, 9]
        )
        .then((x) =>
          assert(
            x[0] == 1 && x[1] == 1 && x[2] == 50 && x[3] == 60,
            "Bathc mint unsuccessful"
          )
        );
    });

    it("Burn tokens", async () => {
      await new Promise((resolve, reject) => {
        instance.burn
          .sendTransaction(accounts[0], 1, 1)
          .on("confirmation", function (confNumber, receipt, latestBlockHash) {
            if (confNumber > testingConfig.blockConfirmation) resolve();
            else console.log(confNumber);
          });
      });
      await instance
        .balanceOf(accounts[0], 1)
        .then((x) => assert(x.toString() == 0), "burn token failed");
    });

    it("Batch burn", async () => {
      await new Promise((resolve, reject) => {
        instance.burnBatch
          .sendTransaction(accounts[0], [2, 3, 7, 9], [1, 1, 50, 60])
          .on("confirmation", function (confNumber, receipt, latestBlockHash) {
            if (confNumber > testingConfig.blockConfirmation) resolve();
            else console.log(confNumber);
          });
      });
      await instance
        .balanceOfBatch(
          [accounts[0], accounts[0], accounts[0], accounts[0]],
          [2, 3, 7, 9]
        )
        .then(
          (x) => assert(x[0] == 0 && x[1] == 0 && x[2] == 0 && x[3] == 0),
          "batch burn failed"
        );
    });

    it("Create token", async () => {
      await new Promise((resolve, reject) => {
        instance.createToken
          .sendTransaction(100, 2, { from: accounts[0] })
          .on("confirmation", function (confNumber, receipt, latestBlockHash) {
            if (confNumber > testingConfig.blockConfirmation) resolve();
            else console.log(confNumber);
          })
          .then(async (results) => {
            await truffleAssert.eventEmitted(
              results,
              "newToken",
              async (ev) =>
                assert(
                  ev.ID == "11" &&
                    ev.amount == "100" &&
                    (await instance.totalTypes.call()) == 11,
                  "event value invalid"
                ),
              "newToken event not emitted"
            );
          });
      });
    });

    it("Batch create token", async () => {
      let currentId = await instance.totalTypes.call();
      // await instance.createTokenBatch
      //   .sendTransaction([1, 3, 55, 43], [2, 3, 4, 5])
      //   .then(async (results) => {
      //     await truffleAssert.eventEmitted(
      //       results,
      //       "newToken",
      //       async (ev) => {
      //         currentId++;
      //         assert(currentId == ev.ID, "Invalid value in event");
      //       },
      //       "newToken event not emitted"
      //     );
      //   });

      await new Promise((resolve, reject) => {
        instance.createTokenBatch
          .sendTransaction([1, 3, 55, 43], [2, 3, 4, 5])
          .on("confirmation", function (confNumber, receipt, latestBlockHash) {
            if (confNumber > testingConfig.blockConfirmation) resolve();
            else console.log(confNumber);
          })
          .then(async (results) => {
            await truffleAssert.eventEmitted(
              results,
              "newToken",
              async (ev) => {
                currentId++;
                assert(currentId == ev.ID, "Invalid value in event");
              },
              "newToken event not emitted"
            );
          });
      });
    });
  }
);
