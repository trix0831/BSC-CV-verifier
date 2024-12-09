require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.20",
//   networks: {
//     bscMainnet: {
//       url: "https://bsc-dataseed.binance.org/",
//       accounts: ["12f9b9c5d505c419f3d313a5f47000c1d4dd1f7660712a2c47adac2d1f20f42f"], // 使用您的 MetaMask 私鑰
//     },
// },
  networks: {
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: ["12f9b9c5d505c419f3d313a5f47000c1d4dd1f7660712a2c47adac2d1f20f42f"], // 用你的 MetaMask 私鑰代替，請注意安全
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      chainId: 43113,
      accounts: ["12f9b9c5d505c419f3d313a5f47000c1d4dd1f7660712a2c47adac2d1f20f42f"], // 用你的 MetaMask 私鑰代替，請注意安全
    },
  },
};
