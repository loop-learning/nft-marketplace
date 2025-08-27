import { useState, useEffect } from "react";
import { Wallet, Tag, Grid3X3, User, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Clock } from "lucide-react";
import { useAccount } from "wagmi";
import { useAppKit, useDisconnect } from "@reown/appkit/react";


const Header = () => {
  const [activeTab, setActiveTab] = useState("marketplace");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
  const location = useLocation();

  const { open } = useAppKit();
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    if (location.pathname === "/list") {
      setActiveTab("list");
    } else if (location.pathname === "/auctions") {
      setActiveTab("auctions");
    } else if (
      location.pathname === "/marketplace" ||
      location.pathname === "/"
    ) {
      setActiveTab("marketplace");
    } else if (location.pathname === "/profile") {
      setActiveTab("profile");
    }
  }, [location]);

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              NFT Marketplace
            </h1>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link
              to="/marketplace"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${activeTab === "marketplace"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
            >
              <Grid3X3 size={20} />
              <span>Marketplace</span>
            </Link>
            <Link
              to="/auctions"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${activeTab === "auctions"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
            >
              <Clock size={20} />
              <span>Auctions</span>
            </Link>
            <Link
              to="/list"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${activeTab === "list"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
            >
              <Tag size={20} />
              <span>List NFT</span>
            </Link>
            <Link
              to="/profile"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${activeTab === "profile"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
            >
              <User size={20} />
              <span>Profile</span>
            </Link>
          </nav>

          <div className="hidden md:block relative">
            {isConnected ? (
              <div className="relative" onClick={() => {
                setIsWalletDropdownOpen(!isWalletDropdownOpen)
              }}>
                <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <Wallet size={20} />
                  <span>Connected</span>
                  <ChevronDown size={16} />
                </button>
                {
                  isWalletDropdownOpen && (
                    <div className="text-white w-48 absolute mt-2 -right-4 bg-gray-800 border border-gray-700 rounded-xl">
                      <div className="border-b p-3">
                        <p className="text-xs text-gray-400">Connected to </p><p className="font-mono">{address.slice(0, 4) + "..." + address.slice(-4)}</p>
                      </div>
                      <button className="text-red-500 p-3" onClick={() => {
                        disconnect()
                        setIsWalletDropdownOpen(false)
                      }}>
                        Disconnect
                      </button>
                    </div>
                  )
                }
              </div>
            ) : (
              <div className="relative">
                <button onClick={() => {
                  open()
                }} className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <Wallet size={20} />
                  <span>Connect Wallet</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white transition-colors"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 mt-2 pt-4 pb-4">
            <div className="flex flex-col space-y-3">
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
