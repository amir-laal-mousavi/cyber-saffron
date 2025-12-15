import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base, polygonAmoy } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Cyber Saffron',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [mainnet, polygon, optimism, arbitrum, base, polygonAmoy],
  ssr: false,
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}