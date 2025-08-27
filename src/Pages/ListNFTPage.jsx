import { useState } from "react";
import { Tag, Gavel, Info, ExternalLink } from "lucide-react";
import Header from "../component/Header";

const ListNFTPage = () => {
  const [listingType, setListingType] = useState("fixed"); // "fixed" or "auction"
  const [nftData, setNftData] = useState({
    nftContract: "",
    tokenId: "",
    price: "",
    duration: 24, // hours for auction
  });

  // Mock for template
  const address = null;
  const isConnected = false;
  
  // Mock for template
  const createListing = async () => console.log('Create listing');
  const createAuction = async () => console.log('Create auction');
  const isPending = false;
  const isConfirming = false;
  const isConfirmed = false;
  const error = null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (listingType === "fixed") {
        // TODO: Call createListing
        await createListing(nftData.nftContract, nftData.tokenId, nftData.price);
      } else {
        // TODO: Call createAuction
        await createAuction(nftData.nftContract, nftData.tokenId, nftData.price, nftData.duration);
      }
    } catch (err) {
      console.error('Transaction failed:', err);
    }
  };

  const resetForm = () => {
    setNftData({
      nftContract: "",
      tokenId: "",
      price: "",
      duration: 24,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">List Your NFT</h2>
          <p className="text-gray-400">
            List your existing NFT for sale or create an auction
          </p>
        </div>

        {/* TODO: Add info card about requirements */}
        <div className="bg-blue-900 border border-blue-700 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <Info size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-blue-300 font-medium mb-1">Before You Start</h3>
              <p className="text-blue-200 text-sm mb-2">
                Make sure you have already minted your NFT on-chain. You'll need the contract address and token ID.
              </p>
              <p className="text-blue-200 text-sm">
                Your NFT must be approved for this marketplace contract to transfer it.
              </p>
            </div>
          </div>
        </div>

        {!isConnected ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <p className="text-gray-400 mb-4">Connect your wallet to list NFTs</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              {/* TODO: Implement listing type selection */}
              <div className="mb-6">
                <h3 className="text-white text-lg font-semibold mb-4">Choose Listing Type</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setListingType("fixed")}
                    className={`p-4 rounded-lg border-2 transition-colors text-left ${
                      listingType === "fixed"
                        ? "border-green-500 bg-green-900/20"
                        : "border-gray-600 bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Tag size={20} className={listingType === "fixed" ? "text-green-400" : "text-gray-400"} />
                      <span className={`font-medium ${listingType === "fixed" ? "text-green-300" : "text-gray-300"}`}>
                        Fixed Price
                      </span>
                    </div>
                    <p className={`text-sm ${listingType === "fixed" ? "text-green-200" : "text-gray-400"}`}>
                      List your NFT at a fixed price for immediate purchase
                    </p>
                  </button>

                  {/* TODO: Add auction option */}
                  <button
                    type="button"
                    onClick={() => setListingType("auction")}
                    className={`p-4 rounded-lg border-2 transition-colors text-left ${
                      listingType === "auction"
                        ? "border-purple-500 bg-purple-900/20"
                        : "border-gray-600 bg-gray-700"
                    }`}
                  >
                    {/* TODO: Implement auction UI */}
                  </button>
                </div>
              </div>

              {/* TODO: Add transaction status display */}
              {(isPending || isConfirming) && (
                <div className="mb-6 p-4 bg-blue-600 rounded-lg">
                  <div className="text-white text-sm">
                    {isPending && 'Confirm transaction in wallet...'}
                    {isConfirming && 'Transaction confirming...'}
                  </div>
                </div>
              )}

              {/* TODO: Add success state */}
              {isConfirmed && (
                <div className="mb-6 p-4 bg-green-600 rounded-lg">
                  <div className="text-white text-sm">
                    {listingType === "fixed" ? "Listing" : "Auction"} created successfully!
                    <button
                      type="button"
                      onClick={resetForm}
                      className="ml-3 underline hover:no-underline"
                    >
                      List another NFT
                    </button>
                  </div>
                </div>
              )}

              {/* TODO: Add error state */}
              {error && (
                <div className="mb-6 p-4 bg-red-600 rounded-lg">
                  <div className="text-white text-sm">
                    <strong>Error:</strong> {error.message}
                  </div>
                </div>
              )}

              {/* TODO: Implement form fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    NFT Contract Address *
                  </label>
                  <input
                    type="text"
                    value={nftData.nftContract}
                    onChange={(e) => setNftData({...nftData, nftContract: e.target.value})}
                    placeholder="0x..."
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    The contract address where your NFT was minted
                  </p>
                </div>

                {/* TODO: Add duration field for auctions */}

                <button
                  type="submit"
                  disabled={isPending || isConfirming || isConfirmed}
                  className={`w-full py-4 rounded-lg font-semibold transition-colors disabled:bg-gray-600 ${
                    listingType === "fixed"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  }`}
                >
                  {isPending || isConfirming ? (
                    `Creating ${listingType === "fixed" ? "Listing" : "Auction"}...`
                  ) : isConfirmed ? (
                    `${listingType === "fixed" ? "Listing" : "Auction"} Created!`
                  ) : (
                    `Create ${listingType === "fixed" ? "Listing" : "Auction"}`
                  )}
                </button>
              </div>
            </div>

            {/* TODO: Add help section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Need Help?</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300">
                    <strong>Approval Required:</strong> Before listing, you must approve this marketplace to transfer your NFT.
                  </p>
                </div>
                {/* TODO: Add more help items */}
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default ListNFTPage;