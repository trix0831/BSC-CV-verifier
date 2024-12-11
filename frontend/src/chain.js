
const Chain = {
    43113:{
        address: process.env.REACT_APP_FUJI_CONTRACT_ADDRESS,
        rpc_url: process.env.REACT_APP_FUJI_URL,
        name: "Fuji"
    },
    43114:{
        address: process.env.REACT_APP_AVA_CONTRACT_ADDRESS,
        rpc_url: process.env.REACT_APP_AVA_URL,
        name: "AVA"
    },
    97:{
        address: process.env.REACT_APP_BSCT_CONTRACT_ADDRESS,
        rpc_url: process.env.REACT_APP_BSCT_URL,
        name: "BSCT"
    },
    96:{
        address: process.env.REACT_APP_BSC_CONTRACT_ADDRESS,
        rpc_url: process.env.REACT_APP_BSC_URL,
        name: "BSC"
    },
};

const defaultChain = {
    address: undefined,
    rpc_url: undefined,
    name: "Unsupported",
};

const getChainInfo = (chainId, is64 = true) => {
    if(is64) return Chain[parseInt(chainId, 16)] || defaultChain;
    return Chain[chainId] || defaultChain;
};

export default getChainInfo;
