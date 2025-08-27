import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {


  const handleClear = () => {

    setSearchTerm('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="relative mb-6">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />

          <input
            type="text"
            placeholder="Search NFTs, collections, or creators..."
            value={searchTerm || ''}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 text-white px-4 py-3 pl-12 pr-10 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;