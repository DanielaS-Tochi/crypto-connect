import hre from "hardhat";

async function main() {
  const [walletClient] = await hre.viem.getWalletClients(); // tipo WalletClient
  const publicClient = await hre.viem.getPublicClient();

  const { deployContract } = hre.viem;

  const deployment = await deployContract("CryptoProfile", [], {
    client: walletClient as any, // ← ⚠️ solución rápida (temporal)
  });

  console.log("✅ Contract deployed at:", deployment.address);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
// This script deploys the CryptoProfile contract using Hardhat and Viem.
// It retrieves the wallet client and public client, then deploys the contract.