import getConfig from 'next/config'
import { Chain } from 'viem'
import { createConfig, http } from 'wagmi'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'
export const storyChain: Chain = {
  id: 1514,
  name: 'Story Mainnet',
  nativeCurrency: {
    name: 'IP',
    symbol: 'IP',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.storyrpc.io/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Story Scan',
      url: 'https://storyscan.xyz/',
    },
    secondary: {
      name: 'Story Explorer',
      url: 'https://explorer.story.foundation/',
    },
  },
}
export const getWagmiConfig = (projectId: string) => {
  const chainInfo = getConfig().CHAIN_INFO
  const auraChain = {
    id: chainInfo.evmChainId,
    name: chainInfo.chainName,
    nativeCurrency: {
      name: chainInfo.nativeCurrency.name,
      symbol: chainInfo.nativeCurrency.symbol,
      decimals: chainInfo.nativeCurrency.decimals,
    },
    rpcUrls: {
      default: {
        http: [chainInfo.rpc[1]],
      },
    },
    blockExplorers: {
      default: {
        name: 'Aurascan',
        url: chainInfo.explorer,
        apiUrl: chainInfo.indexerV2,
      },
    },
  }
  return createConfig({
    chains: [storyChain, auraChain],
    connectors: [ metaMask(), injected()],
    transports: {
      [auraChain.id]: http(),
      [storyChain.id]: http(),
    },
  })
}
