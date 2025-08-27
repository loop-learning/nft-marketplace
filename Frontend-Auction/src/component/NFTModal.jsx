import { useState } from "react";
import { X, ShoppingCart, Gavel } from "lucide-react";
import { useAccount } from "wagmi";
import { useMarketplace } from "../hooks/useMarketplace";
import { useEffect } from "react";

const NFTModal = ({ nft, isOpen, onClose }) => {
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showBidForm, setShowBidForm] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerDuration, setOfferDuration] = useState(7);

  const { address, isConnected } = useAccount();

  const {
    purchaseListing,
    cancelListing,
    isExpired,
    formatPrice,
    isConfirmed,
    isConfirming,
    isPending,
    error,
  } = useMarketplace();
  const makeOffer = async () => console.log("Make offer");
  const endAuction = async () => console.log("End auction");
  const acceptOffer = async () => console.log("Accept offer");

  const { data: offers } = {
    offers: [
      {
        id: 1,
        amount: "1.5",
        duration: 7,
        buyer: "0x123...",
      },
      {
        id: 2,
        amount: "2.0",
        duration: 7,
        buyer: "0x456...",
      },
    ],
  };

  const [didCancel, setDidCancel] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (isConfirmed && didCancel) {
      setCancelled(true);
    }
  }, [isConfirmed]);

  const handlePurchase = async () => {
    if (!nft.isFixed || !nft.listingId) return;
    try {
      await purchaseListing(nft.listingId, nft.price);
    } catch (err) {}
  };

  const handlePlaceBid = async () => {
    if (!bidAmount || !nft.auctionId) return;
    try {
      await placeBid(nft.auctionId, bidAmount);
      setShowBidForm(false);
      setBidAmount("");
    } catch (err) {}
  };

  const handleMakeOffer = async () => {
    if (!offerAmount || !nft.contractAddress || !nft.tokenId) return;
    try {
      await makeOffer(
        nft.contractAddress,
        nft.tokenId,
        offerAmount,
        offerDuration
      );
      setShowOfferForm(false);
      setOfferAmount("");
    } catch (err) {}
  };

  const handleEndAuction = async () => {
    if (!nft.auctionId) return;
    try {
      await endAuction(nft.auctionId);
    } catch (err) {}
  };

  const handleAcceptOffer = async (offerId) => {
    try {
      await acceptOffer(offerId);
    } catch (err) {}
  };

  const handleCancelListing = async () => {
    if (!nft.listingId) return;
    try {
      setDidCancel(true);
      await cancelListing(nft.listingId);
    } catch (err) {}
  };

  const formatTimeRemaining = (endTime) => {
    if (!endTime) return null;
    const now = new Date();
    const timeLeft = new Date(endTime * 1000) - now;

    if (timeLeft <= 0) return "Ended";

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (!isOpen || !nft) return null;

  const isOwner =
    address && nft.seller && address.toLowerCase() === nft.seller.toLowerCase();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">{nft.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* NFT Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden">
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Traits</h3>
              <div className="grid grid-cols-2 gap-2">
                {nft.traits && nft.traits.length > 0 ? (
                  nft.traits.map((trait, index) => (
                    <div
                      key={index}
                      className="bg-gray-600 rounded-lg p-2 text-center"
                    >
                      <div className="text-gray-300 text-xs">
                        {trait.trait_type}
                      </div>
                      <div className="text-white text-sm font-medium">
                        {trait.value}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center text-gray-400 py-4">
                    No traits available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* NFT Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-2">Description</h3>
              <p className="text-gray-300">{nft.description}</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-300 text-sm mb-1">
                {nft.isFixed ? "Listed Price" : "Last Sale Price"}
              </div>
              <div className="text-3xl font-bold text-white mb-4">
                {nft.price || "0.00"} ETH
              </div>

              {(isPending || isConfirming) && (
                <div className="mb-4 p-3 bg-blue-600 rounded-lg">
                  <div className="text-white text-sm">
                    {isPending && "Confirm transaction in wallet..."}
                    {isConfirming && "Transaction confirming..."}
                  </div>
                </div>
              )}

              {isConfirmed && (
                <div className="mb-4 p-3 bg-green-600 rounded-lg">
                  <div className="text-white text-sm">
                    Transaction confirmed!
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-600 rounded-lg">
                  <div className="text-white text-sm">
                    Error: {error.message}
                  </div>
                </div>
              )}

              {!isConnected ? (
                <div className="text-center py-4">
                  <p className="text-gray-400 mb-2">
                    Connect wallet to interact with this NFT
                  </p>
                </div>
              ) : isOwner ? (
                <div className="space-y-2">
                  {nft.isFixed && !cancelled && (
                    <button
                      onClick={handleCancelListing}
                      disabled={isPending || isConfirming}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                    >
                      <X size={20} />
                      <span>Cancel Listing</span>
                    </button>
                  )}

                  {!nft.isFixed &&
                    nft.endTime &&
                    formatTimeRemaining(nft.endTime) === "Ended" && (
                      <button
                        onClick={handleEndAuction}
                        disabled={isPending || isConfirming}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                      >
                        <Gavel size={20} />
                        <span>End Auction</span>
                      </button>
                    )}
                  {nft.isFixed && (
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
                      <Tag size={20} />
                      <span>Create Listing</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {nft.isFixed && (
                    <button
                      onClick={handlePurchase}
                      disabled={isPending || isConfirming}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart size={20} />
                      <span>Buy Now</span>
                    </button>
                  )}

                  {!nft.isAuction &&
                    nft.endTime &&
                    formatTimeRemaining(nft.endTime) !== "Ended" && (
                      <button
                        onClick={() => setShowBidForm(!showBidForm)}
                        disabled={isPending || isConfirming}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                      >
                        <TrendingUp size={20} />
                        <span>Place Bid</span>
                      </button>
                    )}

                  {!nft.isFixed && (
                    <button
                      onClick={() => setShowOfferForm(!showOfferForm)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                    >
                      <Gavel size={20} />
                      <span>Make Offer</span>
                    </button>
                  )}
                </div>
              )}

              {showOfferForm && (
                <div className="mt-4 p-4 bg-gray-600 rounded-lg">
                  <div className="mt-4 p-4 bg-gray-600 rounded-lg">
                    <h4 className="text-white font-semibold mb-3">
                      Make an Offer
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">
                          Offer Amount (ETH)
                        </label>
                        <input
                          type="number"
                          step="0.001"
                          value={offerAmount}
                          onChange={(e) => setOfferAmount(e.target.value)}
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">
                          Offer Duration (days)
                        </label>
                        <select
                          value={offerDuration}
                          onChange={(e) =>
                            setOfferDuration(Number(e.target.value))
                          }
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                        >
                          <option value={1}>1 day</option>
                          <option value={3}>3 days</option>
                          <option value={7}>7 days</option>
                          <option value={14}>14 days</option>
                          <option value={30}>30 days</option>
                        </select>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleMakeOffer}
                          disabled={!offerAmount || isPending || isConfirming}
                          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-2 rounded font-semibold transition-colors"
                        >
                          Submit Offer
                        </button>
                        <button
                          onClick={() => setShowOfferForm(false)}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Bid Form */}
              {showBidForm && (
                <div className="mt-4 p-4 bg-gray-600 rounded-lg">
                  <h4 className="text-white font-semibold mb-3">Place a Bid</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">
                        Bid Amount (ETH)
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-green-500 focus:outline-none"
                        placeholder="0.00"
                        min={
                          parseFloat(
                            nft.currentBid || nft.startingPrice || nft.price
                          ) + 0.001
                        }
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        Minimum bid:{" "}
                        {(
                          parseFloat(
                            nft.currentBid || nft.startingPrice || nft.price
                          ) + 0.001
                        ).toFixed(3)}{" "}
                        ETH
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handlePlaceBid}
                        disabled={
                          !bidAmount ||
                          parseFloat(bidAmount) <=
                            parseFloat(
                              nft.currentBid || nft.startingPrice || nft.price
                            ) ||
                          isPending ||
                          isConfirming
                        }
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 rounded font-semibold transition-colors"
                      >
                        Place Bid
                      </button>
                      <button
                        onClick={() => setShowBidForm(false)}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Current Offers Section - Only show for owners */}
              {isOwner && offers && offers.length > 0 && (
                <div className="mt-4 p-4 bg-gray-600 rounded-lg">
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    <Gavel size={18} className="mr-2" />
                    Current Offers ({offers.length})
                  </h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {offers
                      .filter((offer) => !isExpired(offer.expiration))
                      .sort((a, b) => Number(b.amount) - Number(a.amount))
                      .map((offer, index) => (
                        <div
                          key={index}
                          className="bg-gray-700 rounded-lg p-3 flex justify-between items-center"
                        >
                          <div>
                            <div className="text-white font-semibold">
                              {formatPrice(offer.amount)} ETH
                            </div>
                            <div className="text-gray-300 text-sm">
                              From: {offer.buyer.slice(0, 6)}...
                              {offer.buyer.slice(-4)}
                            </div>
                            <div className="text-gray-400 text-xs">
                              Expires:{" "}
                              {new Date(
                                Number(offer.expiration) * 1000
                              ).toLocaleDateString()}
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleAcceptOffer(offer.offerId || index)
                            }
                            disabled={isPending || isConfirming}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition-colors text-sm"
                          >
                            Accept
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Collection</span>
                <span className="text-white font-medium">
                  {nft.collection || "Unknown"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTModal;
