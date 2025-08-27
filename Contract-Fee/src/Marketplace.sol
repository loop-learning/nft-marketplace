// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTMarketplace {
    uint256 public listingCounter = 0;

    struct Listing {
        uint256 listingId;
        address nftContract;
        uint256 tokenId;
        address seller;
        uint256 price;
        bool active;
    }

    // listing_id -> struct
    mapping(uint256 => Listing) public listings;

    mapping(address => mapping(uint256 => uint256)) public nftToListing;

    event ListingCreated(
        uint256 indexed listingId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        uint256 price
    );

    event ListingCancelled(uint256 indexed listingId);

    event MarketPlaceCreated(address indexed owner);

    event ListingPurchased(
        uint256 indexed listingId,
        address indexed buyer,
        uint256 price
    );

    constructor() {
        emit MarketPlaceCreated(msg.sender);
    }

    function createListing(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external {
        require(price > 0, "Price must be greater than 0");
        require(nftContract != address(0), "Invalid NFT Contract");

        require(
            IERC721(nftContract).ownerOf(tokenId) == msg.sender,
            "You don't own the NFT"
        );

        require(
            IERC721(nftContract).isApprovedForAll(msg.sender, address(this)) ||
                IERC721(nftContract).getApproved(tokenId) == address(this),
            "Marketplace not approved"
        );

        listingCounter++;

        listings[listingCounter] = Listing({
            listingId: listingCounter,
            nftContract: nftContract,
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            active: true
        });

        nftToListing[nftContract][tokenId] = listingCounter;

        emit ListingCreated(
            listingCounter,
            nftContract,
            tokenId,
            msg.sender,
            price
        );
    }

    function cancelListing(uint256 listingId) external {
        Listing storage listing = listings[listingId];

        require(listing.active, "Listing not active");
        require(listing.seller == msg.sender, "Not the seller");

        listing.active = false;

        nftToListing[listing.nftContract][listing.tokenId] = 0;

        emit ListingCancelled(listingId);
    }

    // Purchase
    function purchaseListing(
        uint256 listingId
    ) external payable {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(msg.value >= listing.price, "Insufficient payment");
        require(msg.sender != listing.seller, "Cannot buy your own listing");

        listing.active = false;
        nftToListing[listing.nftContract][listing.tokenId] = 0;

        IERC721(listing.nftContract).safeTransferFrom(
            listing.seller,
            msg.sender,
            listing.tokenId
        );

        payable(listing.seller).transfer(listing.price);

        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }

        emit ListingPurchased(listingId, msg.sender, listing.price);
    }

    function getActiveListings(
        uint256 offset,
        uint256 limit
    ) external view returns (Listing[] memory) {
        uint256 activeCount = 0;

        for (uint256 i = 1; i <= listingCounter; i++) {
            if (listings[i].active) {
                activeCount++;
            }
        }

        if (offset >= activeCount) {
            return new Listing[](0);
        }

        uint256 returnCount = limit;

        if (offset + limit > activeCount) {
            returnCount = activeCount - offset;
        }

        Listing[] memory results = new Listing[](returnCount);
        uint256 currentIndex = 0;
        uint256 resultIndex = 0;

        for (
            uint256 i = 1;
            i <= listingCounter && resultIndex < returnCount;
            i++
        ) {
            if (listings[i].active) {
                if (currentIndex >= offset) {
                    results[resultIndex] = listings[i];
                    resultIndex++;
                }
                currentIndex++;
            }
        }

        return results;
    }

    function getUserListings(
        address user
    ) external view returns (Listing[] memory) {
        uint256 activeCount = 0;

        for (uint256 i = 0; i < listingCounter; i++) {
            if (listings[i].seller == user && listings[i].active) {
                activeCount++;
            }
        }

        Listing[] memory results = new Listing[](activeCount);
        uint256 resultCount = 0;

        for (
            uint256 i = 0;
            i <= listingCounter && resultCount < activeCount;
            i++
        ) {
            if (listings[i].seller == user && listings[i].active) {
                results[resultCount] = listings[i];
                resultCount++;
            }
        }

        return results;
    }
}