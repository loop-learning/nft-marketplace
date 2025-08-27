import React, { useState, useMemo } from "react";
import Header from "../component/Header";
import Filters from "../component/Filters";
import NFTCard from "../component/NFTCard";
import NFTModal from "../component/NFTModal";
import SearchBar from "../component/SearchBar";
import LoadingSpinner from "../component/LoadingSpinner";
// TODO: Import useMarketplace hook
// import { useMarketplace } from "../hooks/useMarketplace";
import { TrendingUp, Clock, DollarSign } from "lucide-react";

// TODO: Move to separate utility file

const MarketplacePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("price-low");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [useDummyData, setUseDummyData] = useState(true);
  
  
  // Mock data for template
  const listings = [];
  const loadingListings = false;
  const error = null;
  const marketplaceFee = 250;
  const formatPrice = (price) => "0.00";
  
  const [dummyNFTs] = useState(generateDummyNFTs());

  // TODO: Convert blockchain listings to NFT format
  const blockchainNFTs = useMemo(() => {
  }, []);

  const allNFTs = useDummyData ? dummyNFTs : [];

  // TODO: Implement filtering and sorting logic
  const filteredNFTs = useMemo(() => {
    let filtered = allNFTs.filter((nft) => {
      const matchesSearch =
        nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.collection.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.owner.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !category || nft.category === category;

      const price = parseFloat(nft.price);
      const matchesPrice =
        (!priceRange.min || price >= parseFloat(priceRange.min)) &&
        (!priceRange.max || price <= parseFloat(priceRange.max));

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // TODO: Implement sorting logic
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "name":
          return a.name.localeCompare(b.name);
        case "recently-listed":
          return b.id - a.id;
        default:
          return 0;
      }
    });

    return filtered;
  }, [allNFTs, searchTerm, sortBy, category, priceRange]);

  // TODO: Implement pagination
  const totalPages = Math.ceil(filteredNFTs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNFTs = filteredNFTs.slice(startIndex, startIndex + itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, category, priceRange, itemsPerPage]);

  const handleNFTClick = (nft) => {
    setSelectedNFT(nft);
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

  // TODO: Calculate stats from real data
  const totalVolume = allNFTs.reduce((sum, nft) => sum + parseFloat(nft.price), 0);
  const avgPrice = totalVolume / (allNFTs.length || 1);
  const floorPrice = Math.min(...allNFTs.map(nft => parseFloat(nft.price)));

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">NFT Marketplace</h2>
              <p className="text-gray-400">
                Discover, collect, and trade unique digital assets
              </p>
            </div>
            
            {/* TODO: Add data source toggle */}
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
              {loadingListings && (
                <div className="text-blue-400 text-sm">Loading...</div>
              )}
              {error && (
                <div className="text-red-400 text-sm">Error loading data</div>
              )}
            </div>
          </div>

          {/* TODO: Implement stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <TrendingUp size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Volume</p>
                  <p className="text-white text-lg font-semibold">{totalVolume.toFixed(2)} ETH</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <DollarSign size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Floor Price</p>
                  <p className="text-white text-lg font-semibold">{floorPrice.toFixed(3)} ETH</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Clock size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Listed Items</p>
                  <p className="text-white text-lg font-semibold">{allNFTs.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TODO: Add marketplace fee display */}
        {marketplaceFee && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
            <p className="text-gray-300 text-sm">
              <span className="font-medium">Marketplace Fee:</span> {(Number(marketplaceFee) / 100).toFixed(1)}%
            </p>
          </div>
        )}

        {/* TODO: Add search and filters */}
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Filters
          sortBy={sortBy}
          setSortBy={setSortBy}
          category={category}
          setCategory={setCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />

        {/* TODO: Add pagination controls */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-400">{filteredNFTs.length} items</p>
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

        {/* TODO: Implement NFT grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {paginatedNFTs.map((nft) => (
            <NFTCard key={nft.id} nft={nft} onClick={handleNFTClick} />
          ))}
        </div>

        {/* TODO: Add empty state */}
        {filteredNFTs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No NFTs found matching your criteria.
            </p>
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
                  Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + index;
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

      {/* TODO: Add NFT modal */}
      <NFTModal
        nft={selectedNFT}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default MarketplacePage;