import React, { useState, useMemo } from "react";
import Header from "../component/Header";
import Filters from "../component/Filters";
import NFTModal from "../component/NFTModal";
import SearchBar from "../component/SearchBar";

import { Clock, Gavel, Activity } from "lucide-react";
import { generateDummyAuctions } from "../utils/dummyData";

const AuctionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("ending-soon");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [useDummyData, setUseDummyData] = useState(true);

  // Mock for template
  const auctions = null;
  const loadingAuctions = false;
  const error = null;
  const formatPrice = (price) => parseFloat(price).toFixed(3);

  const [dummyAuctions] = useState(generateDummyAuctions());

  // TODO: Convert blockchain auctions to NFT format
  const blockchainAuctions = useMemo(() => {}, []);

  const allAuctions = useDummyData ? dummyAuctions : [];

  // TODO: Filter and sort auctions - implement blockchain-specific sorting
  const filteredAuctions = useMemo(() => {
    let filtered = allAuctions.filter((auction) => {
      const matchesSearch =
        auction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auction.collection.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auction.seller.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !category || auction.category === category;

      const price = parseFloat(auction.currentBid || auction.price);
      const matchesPrice =
        (!priceRange.min || price >= parseFloat(priceRange.min)) &&
        (!priceRange.max || price <= parseFloat(priceRange.max));

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // TODO: Implement auction-specific sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "ending-soon":
          return new Date(a.endTime) - new Date(b.endTime);
        case "price-low":
          return (
            parseFloat(a.currentBid || a.price) -
            parseFloat(b.currentBid || b.price)
          );
        case "price-high":
          return (
            parseFloat(b.currentBid || b.price) -
            parseFloat(a.currentBid || a.price)
          );
        case "bid-count":
          return (b.bidCount || 0) - (a.bidCount || 0);
        case "recently-listed":
          return b.id - a.id;
        default:
          return 0;
      }
    });

    return filtered;
  }, [allAuctions, searchTerm, sortBy, category, priceRange]);

  // Pagination
  const totalPages = Math.ceil(filteredAuctions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAuctions = filteredAuctions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, category, priceRange, itemsPerPage]);

  const handleNFTClick = (auction) => {
    setSelectedNFT(auction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNFT(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // TODO: Calculate auction stats from blockchain data
  const totalVolume = allAuctions.reduce(
    (sum, auction) => sum + parseFloat(auction.currentBid || auction.price),
    0
  );
  const activeAuctions = allAuctions.filter(
    (auction) => auction.isActive !== false
  ).length;
  const endingSoon = allAuctions.filter((auction) => {
    const timeLeft = new Date(auction.endTime) - new Date();
    return timeLeft > 0 && timeLeft < 24 * 60 * 60 * 1000; // Less than 24 hours
  }).length;

  // Auction-specific sort options
  const auctionSortOptions = [
    { value: "ending-soon", label: "Ending Soon" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "bid-count", label: "Most Bids" },
    { value: "recently-listed", label: "Recently Listed" },
  ];

  // TODO: Format time remaining with real-time updates
  const formatTimeRemaining = (endTime) => {
    if (!endTime) return null;
    const now = new Date();
    const timeLeft = new Date(endTime) - now;

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

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Live Auctions
              </h2>
              <p className="text-gray-400">
                Bid on unique digital assets in real-time auctions
              </p>
            </div>

            {/* Data Source Toggle */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-white">
                <input
                  type="checkbox"
                  checked={!useDummyData}
                  onChange={(e) => setUseDummyData(!e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Live Data</span>
              </label>
              {loadingAuctions && (
                <div className="text-blue-400 text-sm">Loading...</div>
              )}
              {error && (
                <div className="text-red-400 text-sm">Error loading data</div>
              )}
            </div>
          </div>

          {/* TODO: Implement auction stats from blockchain data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Gavel size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Volume</p>
                  <p className="text-white text-lg font-semibold">
                    {totalVolume.toFixed(2)} ETH
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <Activity size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Active Auctions</p>
                  <p className="text-white text-lg font-semibold">
                    {activeAuctions}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-600 rounded-lg">
                  <Clock size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Ending Soon</p>
                  <p className="text-white text-lg font-semibold">
                    {endingSoon}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* TODO: Add auction-specific filters */}
        <Filters
          sortBy={sortBy}
          setSortBy={setSortBy}
          category={category}
          setCategory={setCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          customSortOptions={auctionSortOptions}
        />

        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-400">
            {filteredAuctions.length} active auctions
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
              className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>
        </div>

        {/* TODO: Implement custom auction cards with blockchain data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {paginatedAuctions.map((auction) => (
            <div key={auction.id} className="relative group">
              {/* TODO: Custom Auction Card Component */}
              <div
                className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleNFTClick(auction)}
              >
                {/* NFT Image */}
                <div className="aspect-square overflow-hidden">
                  <img
                    src={auction.image}
                    alt={auction.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>

                {/* TODO: Auction-specific content layout */}
                <div className="p-4">
                  <h3 className="text-white font-semibold truncate">
                    {auction.name}
                  </h3>
                  <p className="text-gray-400 text-sm truncate">
                    {auction.collection}
                  </p>
                  <div className="mt-2">
                    {/* TODO: Display current bid from blockchain */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Current Bid</span>
                      <span className="text-green-400 font-bold">
                        {auction.currentBid || auction.startingPrice} ETH
                      </span>
                    </div>
                    {/* TODO: Real-time countdown timer */}
                    {auction.endTime && (
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-gray-400 text-xs">Time Left</span>
                        <span className="text-yellow-400 text-xs font-medium">
                          {formatTimeRemaining(auction.endTime)}
                        </span>
                      </div>
                    )}
                    {/* TODO: Display bid count from blockchain */}
                    {auction.bidCount > 0 && (
                      <div className="text-center mt-2 text-gray-300 text-xs">
                        {auction.bidCount} bids
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* TODO: Auction badge overlay */}
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                <Clock size={12} />
                <span>Auction</span>
              </div>

              {/* TODO: Urgency indicator for ending soon */}
              {auction.endTime &&
                formatTimeRemaining(auction.endTime) !== "Ended" && (
                  <div className="absolute top-2 right-2">
                    {(() => {
                      const timeLeft = new Date(auction.endTime) - new Date();
                      const isUrgent = timeLeft < 24 * 60 * 60 * 1000; // Less than 24 hours
                      return (
                        <div
                          className={`text-white text-xs px-2 py-1 rounded ${
                            isUrgent
                              ? "bg-red-600 animate-pulse"
                              : "bg-gray-800/80"
                          }`}
                        >
                          {formatTimeRemaining(auction.endTime)}
                        </div>
                      );
                    })()}
                  </div>
                )}
            </div>
          ))}
        </div>

        {filteredAuctions.length === 0 && (
          <div className="text-center py-12">
            <div className="flex flex-col items-center">
              <Gavel size={48} className="text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">
                No active auctions found matching your criteria.
              </p>
            </div>
          </div>
        )}

        {/* Complete Pagination UI - Students focus on blockchain integration */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentPage === 1
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                Previous
              </button>

              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                const pageNum =
                  Math.max(1, Math.min(currentPage - 2, totalPages - 4)) +
                  index;
                if (pageNum > totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      pageNum === currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      {/* TODO: Add NFT modal with auction-specific actions */}
      <NFTModal
        nft={selectedNFT}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default AuctionsPage;
