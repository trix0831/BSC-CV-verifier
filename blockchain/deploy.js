
async function main() {
  // 獲取合約工廠，這是用來部署合約的模板
  const MyContract = await ethers.getContractFactory("MyToken");

  // 部署合約
  const myContract = await MyContract.deploy("0xcAcE68A2c3CC23380fA8eA924313e3E7D115B9Ba");
  await myContract.deployed();

  console.log("Contract deployed to:", myContract.address);
}

main();
// nft (testnet): 0xfa261a66449048642c903C955F7A64372dc4A4c5
// https://chocolate-secret-porpoise-96.mypinata.cloud/ipfs/QmbxASzKpA6LzFdHVFhYFUMrsMjT3s2MZoRbH8nr93GmXY
// bsc mainnet: 0xfa261a66449048642c903C955F7A64372dc4A4c5 
// sender nft (testnet): : 0x4232b1357eF1Bbd178EF5bCe7A0ACD7c8e3878c1 
// All can mint: 0x57a245cC5588543AE905C21F2E6f793Fcc4180F4