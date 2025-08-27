import { useState } from "react";
import Header from "../component/Header";
import { Copy } from "lucide-react";
import { useAccount } from "wagmi";

const ProfilePage = () => {

  const { address: walletAddress } = useAccount()

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-white mb-8">Profile</h2>

          {/* Wallet Address */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Wallet Address
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-white font-mono bg-gray-700 px-4 py-2 rounded-lg">
                {walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4)}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
