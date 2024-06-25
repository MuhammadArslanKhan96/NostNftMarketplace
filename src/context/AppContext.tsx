
"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import Cookies from "js-cookie";

const AppContext = createContext({} as any); // Provide a default value to the context

declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider | null;
  }
}

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [wallet, setWallet] = useState<any>();
  const getUserWalletAddresses = async (): Promise<void> => {
    try {
      await (window.ethereum as any).request({ method: "eth_requestAccounts" });
    } catch (accountError) {
      // Handle error if needed
    }
  };
  const getEthersInstance = async (
    networkId: number
  ): Promise<ethers.providers.Provider> => {
    let ethersProvider: ethers.providers.Provider;

    if (window.ethereum) {
      ethersProvider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );
    } else {
      const publicEndpoint = "https://rpc-amoy.polygon.technology";
      ethersProvider = new ethers.providers.JsonRpcProvider(publicEndpoint);
    }

    const currentNetworkId = await ethersProvider
      .getNetwork()
      .then((network: any) => network.chainId);

    if (currentNetworkId !== networkId && window.ethereum) {
      try {
        await (window.ethereum as any).request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${networkId.toString(16)}` }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await (window.ethereum as any).request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${networkId.toString(16)}`,
                  chainName: "Polygon Amoy Testnet",
                  nativeCurrency: {
                    name: "Polygon Amoy Testnet",
                    symbol: "MATIC",
                    decimals: 18,
                  },
                  rpcUrls: ["https://rpc-amoy.polygon.technology"],
                },
              ],
            });
          } catch (addError) {
            // Handle "add" error
          }
        }
        // Handle other "switch" errors
      }
    }

    if (window.ethereum) {
      await getUserWalletAddresses();
    }

    return ethersProvider;
  };

  const getWalletFunction = () => {
    if (window.ethereum && window.ethereum.request) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })

        .then((res: any) => {
          const Wallet = res.length > 0 && String(res[0]);
          console.log(Wallet, "YO");
          !wallet && setWallet(Wallet);
        })

        .catch((err: any) => {
          console.log(err);
        });
    } else {
      alert("install metamask extension!!");
    }
  };

  useEffect(() => {
    window.addEventListener("DOMContentLoaded", () => {
      if (Cookies.get("wallet")) {
        getEthersInstance(80002).catch((error: any) => {
          console.error("Error:", error);
        });
      }
    })
  }, [])

  useEffect(() => {
    getEthersInstance(80002).catch((error: any) => {
      console.error("Error:", error);
    });
  }, [wallet]);

  return (
    <AppContext.Provider
      value={{
        wallet,
        setWallet,
        getEthersInstance,
        getWalletFunction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;

export const useAppContext = () => useContext(AppContext); // Use the correct context
