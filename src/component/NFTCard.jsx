import React from 'react';

const NFTCard = ({ nft, onClick }) => {

  const handleClick = () => {
    onClick(nft);
  };


  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="aspect-square overflow-hidden relative">
        
        <img 
          src={nft?.image || 'https://via.placeholder.com/400x400?text=NFT'}
          alt={nft?.name || 'NFT'}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        
      </div>

      <div className="p-4">
        <h3 className="text-white font-semibold truncate">
          {nft?.name || 'Unnamed NFT'}
        </h3>
        
        <p className="text-gray-400 text-sm truncate">
          {nft?.collection || 'Unknown Collection'}
        </p>
        
        <div className="mt-3 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Price</span>
            <span className="text-white font-bold">
              {nft?.price || '0.00'} ETH
            </span>
          </div>
          
          {nft?.lastSale && (
            <div className="flex flex-col text-right">
              <span className="text-xs text-gray-400">Last Sale</span>
              <span className="text-green-400 text-sm">
                {nft.lastSale} ETH
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default NFTCard;