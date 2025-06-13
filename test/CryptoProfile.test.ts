import { expect } from "chai";
import hre from "hardhat";
import CryptoProfileArtifact from "../artifacts/contracts/CryptoProfile.sol/CryptoProfile.json";

describe("CryptoProfile contract", function () {
  let walletClient: any;
  let publicClient: any;
  let contractAddress: string;

  before(async () => {
    [walletClient] = await hre.viem.getWalletClients();
    publicClient = await hre.viem.getPublicClient();

    const { deployContract } = hre.viem;

    const deployment = await deployContract("CryptoProfile", [], {
      client: walletClient as any,
    });

    contractAddress = deployment.address;
  });

  it("Should create a profile and emit ProfileCreated event", async () => {
    const txHash = await walletClient.writeContract({
      address: contractAddress,
      abi: CryptoProfileArtifact.abi,
      functionName: "createProfile",
      args: ["alice"],
    });

    // Esperar a que la transacción sea minada con publicClient
    await publicClient.waitForTransactionReceipt({ hash: txHash });

    const [username] = await publicClient.readContract({
      address: contractAddress,
      abi: CryptoProfileArtifact.abi,
      functionName: "getProfile",
      args: [walletClient.account.address],
    });

    expect(username).to.equal("alice");
  });

  it("Should add a favorite crypto and emit CryptoAdded event", async () => {
    const txHash = await walletClient.writeContract({
      address: contractAddress,
      abi: CryptoProfileArtifact.abi,
      functionName: "addFavoriteCrypto",
      args: ["Bitcoin"],
    });

    // Esperar a que la transacción sea minada con publicClient
    await publicClient.waitForTransactionReceipt({ hash: txHash });

    const [, favoriteCryptos] = await publicClient.readContract({
      address: contractAddress,
      abi: CryptoProfileArtifact.abi,
      functionName: "getProfile",
      args: [walletClient.account.address],
    });

    expect(favoriteCryptos).to.include("Bitcoin");
  });
  it("Should store multiple favorite cryptos", async () => {
  const cryptos = ["Ethereum", "Polygon", "Solana"];
  for (const crypto of cryptos) {
    const txHash = await walletClient.writeContract({
      address: contractAddress,
      abi: CryptoProfileArtifact.abi,
      functionName: "addFavoriteCrypto",
      args: [crypto],
    });
    await publicClient.waitForTransactionReceipt({ hash: txHash });
  }

  const [, favoriteCryptos] = await publicClient.readContract({
    address: contractAddress,
    abi: CryptoProfileArtifact.abi,
    functionName: "getProfile",
    args: [walletClient.account.address],
  });

  expect(favoriteCryptos).to.include.members(cryptos);
});

// it("Should emit correct parameters in ProfileCreated event", async () => {
//   const username = "EventoTest";

//   const txHash = await walletClient.writeContract({
//     address: contractAddress,
//     abi: CryptoProfileArtifact.abi,
//     functionName: "createProfile",
//     args: [username],
//   });

//   const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

//   const event = receipt.logs.find((log: any) =>
//   log.topics[0] ===
//     publicClient.abi.getEventSelector({
//       abi: CryptoProfileArtifact.abi,
//       eventName: "ProfileCreated",
//     })
// );


//   expect(event).to.exist;
// });
it("Should return empty profile for a user with no profile", async () => {
  const dummyAddress = "0x000000000000000000000000000000000000dead";

  const [username, cryptos] = await publicClient.readContract({
    address: contractAddress,
    abi: CryptoProfileArtifact.abi,
    functionName: "getProfile",
    args: [dummyAddress],
  });

  expect(username).to.equal("");
  expect(cryptos).to.be.an("array").that.is.empty;
});
    
    // it("Should allow removing a favorite crypto", async () => {
    //     const crypto = "CryptoToRemove";

    //     // Add the crypto first
    //     await walletClient.writeContract({
    //         address: contractAddress,
    //         abi: CryptoProfileArtifact.abi,
    //         functionName: "addFavoriteCrypto",
    //         args: [crypto],
    //     });

    //     // Now remove it
    //     const txHash = await walletClient.writeContract({
    //         address: contractAddress,
    //         abi: CryptoProfileArtifact.abi,
    //         functionName: "removeFavoriteCrypto",
    //         args: [crypto],
    //     });

    //     await publicClient.waitForTransactionReceipt({ hash: txHash });

    //     const [, favoriteCryptos] = await publicClient.readContract({
    //         address: contractAddress,
    //         abi: CryptoProfileArtifact.abi,
    //         functionName: "getProfile",
    //         args: [walletClient.account.address],
    //     });

    //     expect(favoriteCryptos).to.not.include(crypto);
    // });
});


// This code is a test suite for the CryptoProfile smart contract using Hardhat and Viem.
// It tests the creation of a user profile and the addition of favorite cryptocurrencies.