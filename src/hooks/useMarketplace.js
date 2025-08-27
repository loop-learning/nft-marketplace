
import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { marketplaceContractABI, marketplaceContractAddress } from "../config/contract";
import { createPublicClient, erc721Abi, formatEther, http, parseEther } from "viem";
import { anvil } from "viem/chains";
import { useState } from "react";

export function useMarketplace() {
  const { writeContract, data: hash, error, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  const client = createPublicClient({
    chain: anvil,
    transport: http()
  })

  const useMarketplaceFee = () => {
    return useReadContract({
      address: marketplaceContractAddress,
      abi: marketplaceContractABI,
      functionName: 'marketplaceFee'
    })
  };

  const useListingCounter = () => {
    return useReadContract({
      address: marketplaceContractAddress,
      abi: marketplaceContractABI,
      functionName: 'listingCounter'
    })
  };

  const useOfferCounter = () => {
    return useReadContract({
      address: marketplaceContractAddress,
      abi: marketplaceContractABI,
      functionName: 'offerCounter'
    })
  };

  const useMarketplacePaused = () => {
    return useReadContract({
      address: marketplaceContractAddress,
      abi: marketplaceContractABI,
      functionName: 'marketplacePaused'
    })
  };

  const useListing = (listingId) => {
    return useReadContract({
      address: marketplaceContractAddress,
      abi: marketplaceContractABI,
      functionName: 'listings',
      args: [listingId],
      enabled: !!listingId
    })
  };

  const useAuction = (auctionId) => {
    return useReadContract({
      address: marketplaceContractAddress,
      abi: marketplaceContractABI,
      functionName: 'auctions',
      args: [auctionId],
      enabled: !!auctionId
    })
  };

  const useOffer = (offerId) => {
    return useReadContract({
      address: marketplaceContractAddress,
      abi: marketplaceContractABI,
      functionName: 'offers',
      args: [offerId],
      enabled: !!offerId
    })
  };

  const useActiveListings = (offset = 0, limit = 50) => {
    return useReadContract({
      address: marketplaceContractAddress,
      abi: marketplaceContractABI,
      functionName: 'getActiveListings',
      args: [BigInt(offset), BigInt(limit)],
    })
  };

  const useActiveAuctions = (offset = 0, limit = 50) => {
    return useReadContract({
      address: marketplaceContractAddress,
      abi: marketplaceContractABI,
      functionName: 'getActiveAuctions',
      args: [BigInt(offset), BigInt(limit)],
    })
  };

  const useUserListings = (userAddress) => {
    return useReadContract({
      address: marketplaceContractAddress,
      abi: marketplaceContractABI,
      functionName: 'getUserListings',
      args: [userAddress],
    })
  };

  const useOffersForNFT = (nftContract, tokenId) => {
    return useReadContract({
      address: marketplaceContractAddress,
      abi: marketplaceContractABI,
      functionName: 'getOffersForNFT',
      args: [nftContract, tokenId],
    })
  };

  const useReadApproval = (nftContract, tokenId) => {
    return useReadContract({
      address: nftContract,
      abi: erc721Abi,
      functionName: "getApproved",
      args: [tokenId],
    })
  };

  const createListing = async (nftContract, tokenId, priceInEth) => {
    return writeContract({
      address: marketplaceContractAddress,
      abi: marketplaceContractABI,
      functionName: "createListing",
      args: [nftContract, BigInt(tokenId), parseEther(priceInEth.toString())]
    })
  };

  const cancelListing = async (listingId) => {
    return writeContract({
      address: marketplaceContractAddress,
      abi: marketplaceContractABI,
      functionName: "cancelListing",
      args: [BigInt(listingId)]
    })
  };

  const purchaseListing = async (listingId, priceInEth) => {
    return writeContract({
      address: marketplaceContractAddress,
      abi: marketplaceContractABI,
      functionName: "purchaseListing",
      args: [BigInt(listingId)],
      value: parseEther(priceInEth.toString())
    })
  };

  const createAuction = async (nftContract, tokenId, startingPriceInEth, durationInHours) => {
    return writeContract({
      address: marketplaceContractAddress,
      abi: marketplaceContractABI,
      functionName: "createAuction",
      args: [nftContract, BigInt(tokenId), parseEther(startingPriceInEth.toString()), BigInt(durationInHours * 3600)]
    })
  };

  const placeBid = async (auctionId, bidAmountInEth) => {
    return writeContract({
      address: marketplaceContractAddress,
      abi: marketplaceContractABI,
      functionName: "placeBid",
      args: [BigInt(auctionId), parseEther(bidAmountInEth.toString())]
    })
  };

  const endAuction = async (auctionId) => {
    return writeContract({
      address: marketplaceContractAddress,
      abi: marketplaceContractABI,
      functionName: "endAuction",
      args: [BigInt(auctionId)]
    })
  };

  const makeOffer = async (nftContract, tokenId, offerAmountInEth, expirationInDays) => {
    const expiration = BigInt(Math.floor(Date.now() / 1000) + (expirationInDays * 24 * 3600))
    return writeContract({
      address: marketplaceContractAddress,
      abi: marketplaceContractABI,
      functionName: "makeOffer",
      args: [nftContract, BigInt(tokenId), expiration],
      value: parseEther(offerAmountInEth.toString())
    })
  };

  const acceptOffer = async (offerId) => {
    return writeContract({
      address: marketplaceContractAddress,
      abi: marketplaceContractABI,
      functionName: "acceptOffer",
      args: [BigInt(offerId)]
    })
  };

  const cancelOffer = async (offerId) => {
    return writeContract({
      address: marketplaceContractAddress,
      abi: marketplaceContractABI,
      functionName: "cancelOffer",
      args: [BigInt(offerId)]
    })
  };

  const approveNFT = async (tokenId, _nftContractAddress) => {
    return writeContract({
      address: _nftContractAddress,
      abi: erc721Abi,
      functionName: "approve",
      args: [marketplaceContractAddress, tokenId],
    })
  }

  const formatPrice = (priceInWei) => {
    return formatEther(priceInWei)
  };

  const isExpired = (timestamp) => {
    return Date.now() / 1000 > Number(timestamp);
  };

  const getTokenURI = async (contractAddress, tokenId) => {
    const _tokenId = await client.readContract({
      address: contractAddress,
      abi: erc721Abi,
      functionName: 'tokenURI',
      args: [tokenId]
    })
    return _tokenId
  }

  const fetchNFTMetadata = async (contractAddress, tokenId) => {
    try {
      const tokenURI = await getTokenURI(contractAddress, tokenId);
      if (!tokenURI) {
        return {
          name: `NFT #${tokenId}`, image: null, description: "NFT Collection #" + Math.random() * 1000, attributes: []
        }
      }
      let metadataURL = tokenURI
      if (tokenURI.startsWith("ipfs://")) {
        metadataURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
      }
      metadataURL = metadataURL + tokenId + ".json"
      const response = await fetch(metadataURL)
      if (!response.ok) {
        throw new Error('Failed to fetch metadata')
      }
      const metadata = await response.json()
      let imageURL = metadata.image
      if (metadata.image.startsWith("ipfs://")) {
        imageURL = metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")
      }

      return {
        name: metadata.name,
        image: imageURL,
        description: metadata.description,
        attributes: metadata.attributes || [],
        collection: `${metadata.name.split(/#[1-9]/)[0] + " " + metadata.name.split(/#[1-9]/)[1]} Collection`
      }
    }
    catch {
      return {
        name: 'NFT #' + tokenId,
        image: null,
        description: "NFT Collection #" + Math.random() * 1000,
        attributes: [],
        collection: `${"NFT"} Collection`
      }
    }
  }

  const [metadataCache, setMetadataCache] = useState(new Map())

  const fetchMetadata = async (contractAddress, tokenId) => {
    const cacheKey = `${contractAddress}:${tokenId}`

    if (metadataCache.has(cacheKey)) {
      return metadataCache.get(cacheKey)
    }

    try {
      const metadata = await fetchNFTMetadata(contractAddress, tokenId)
      setMetadataCache(prev => new Map(prev).set(cacheKey, metadata))
      return metadata
    }
    catch {
      return null
    }
  }


  return {
    // Read hooks
    useMarketplaceFee,
    useListingCounter,
    useOfferCounter,
    useMarketplacePaused,
    useListing,
    useAuction,
    useOffer,
    useActiveListings,
    useActiveAuctions,
    useUserListings,
    useOffersForNFT,
    useReadApproval,

    // Write functions
    createListing,
    cancelListing,
    purchaseListing,
    createAuction,
    placeBid,
    endAuction,
    makeOffer,
    acceptOffer,
    cancelOffer,
    approveNFT,

    // Transaction state
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,

    // Utilities
    formatPrice,
    isExpired,
    fetchMetadata,
    metadataCache
  };
}