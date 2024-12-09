
const Chain = {
    43113:{
        address: process.env.REACT_APP_FUJI_CONTRACT_ADDRESS,
        rpc_url: process.env.REACT_APP_FUJI_URL,
        name: "Fuji"
    },
    97:{
        address: process.env.REACT_APP_BSCT_CONTRACT_ADDRESS,
        rpc_url: process.env.REACT_APP_BSCT_URL,
        name: "BSCT"
    },
};

const defaultChain = {
    address: undefined,
    rpc_url: undefined,
    name: "Unsupported",
};

const getChainInfo = (chainId) => {
    return Chain[parseInt(chainId, 16)] || defaultChain;
};

export default getChainInfo;
