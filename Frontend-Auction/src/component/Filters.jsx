import { ChevronDown, Filter, X } from 'lucide-react';

const Filters = ({
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange
}) => {

  const sortOptions = [
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'recently-listed', label: 'Recently Listed' },
    { value: 'name', label: 'Name A-Z' },
  ];

  const handlePriceRangeChange = (field, value) => {
    setPriceRange(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setPriceRange({ min: '', max: '' });
  };

  const hasActiveFilters = priceRange?.min || priceRange?.max;

  return (
    <div className="mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Sort Dropdown */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <label className="block text-gray-400 text-sm mb-1">Sort By</label>
            <div className="relative">
              <select
                value={sortBy || 'price-low'}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-gray-800 text-white px-4 py-2 pr-8 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

        </div>

        {/* Filters Container */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">

          {/* Price Range Filter */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">Price Range (ETH)</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange?.min || ''}
                onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                className="w-20 bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
              <span className="text-gray-400">to</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange?.max || ''}
                onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                className="w-20 bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>


          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
            >
              <X size={16} />
              <span className="text-sm">Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;