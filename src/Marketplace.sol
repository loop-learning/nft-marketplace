// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTMarketplace {
    uint256 public marketplaceFee = 250; // 2.5%
    uint256 public listingCounter = 0;
    uint256 public offerCounter = 0;

    uint256 public constant MAX_FEE = 1000; // 10%

    struct Listing {
        uint256 listingId;
        address nftContract;
        uint256 tokenId;
        address seller;
        uint256 price;
        bool active;
    }

    struct Auction {
        uint256 auctionId;
        address nftContract;
        uint256 tokenId;
        address seller;
        uint256 startingPrice;
        uint256 currentBid;
        address currentBidder;
        uint256 endTime;
        bool active;
    }

    struct Offer {
        uint256 offerId;
        address nftContract;
        uint256 tokenId;
        address buyer;
        uint256 amount;
        uint256 expiration;
        bool active;
    }

    // listing_id -> struct
    mapping(uint256 => Listing) public listings;

    mapping(address => mapping(uint256 => uint256)) public nftToListing;

    mapping(uint256 => Auction) public auctions;

    mapping(address => mapping(uint256 => uint256)) public nftToAuction;

    mapping(uint256 => Offer) public offers;

    mapping(address => mapping(uint256 => uint256[])) public nftToOffer;

    event ListingCreated(
        uint256 indexed listingId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        uint256 price
    );

    event AuctionCreated(
        uint256 indexed auctionId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        uint256 startingPrice,
        uint256 endTime
    );

    event BidPlaced(
        uint256 indexed auctionId,
        address indexed bidded,
        uint256 amount
    );

    event AuctionEnded(
        uint256 indexed auctionId,
        address indexed winner,
        uint256 amount
    );

    event ListingCancelled(uint256 indexed listingId);

    event MarketPlaceCreated(address indexed owner);

    event MarketPlaceFeeUpdated(uint256 newFee);

    event ListingPurchased(
        uint256 indexed listingId,
        address indexed buyer,
        uint256 price
    );

    event OfferCreated(
        uint256 indexed offerId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address buyer,
        uint256 amount,
        uint256 expiration
    );

    event OfferAccepted(uint256 indexed offerId);
    event OfferCancelled(uint256 indexed offerId);

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

        uint256 fee = (listing.price * marketplaceFee) / 10000;
        uint256 sellerAmount = listing.price - fee;

        payable(listing.seller).transfer(sellerAmount);

        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }

        emit ListingPurchased(listingId, msg.sender, listing.price);
    }

    // Marketplace Fee
    function withdrawFees() external {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(msg.sender).transfer(balance);
    }

    function updateMarketplaceFee(uint256 newFee) external {
        require(newFee <= MAX_FEE, "Fee cannot exceed 10%");
        marketplaceFee = newFee;
        emit MarketPlaceFeeUpdated(newFee);
    }

    // Auction

    function createAuction(
        address nftContract,
        uint256 tokenId,
        uint256 startingPrice,
        uint256 duration
    ) external {
        require(startingPrice > 0, "Price must be greater than 0");

        require(nftContract != address(0), "Invalid NFT Contract");

        require(
            IERC721(nftContract).ownerOf(tokenId) == msg.sender,
            "You don't own the NFT"
        );

        require(duration >= 1 hours && duration <= 30 days, "Invalid duration");

        require(
            nftToAuction[nftContract][tokenId] == 0,
            "NFT is already in auction"
        );

        require(
            IERC721(nftContract).isApprovedForAll(msg.sender, address(this)) ||
                IERC721(nftContract).getApproved(tokenId) == address(this),
            "Marketplace not approved"
        );

        listingCounter++;

        auctions[listingCounter] = Auction({
            auctionId: listingCounter,
            nftContract: nftContract,
            tokenId: tokenId,
            seller: msg.sender,
            startingPrice: startingPrice,
            currentBid: 0,
            currentBidder: address(0),
            endTime: block.timestamp + duration,
            active: true
        });

        nftToAuction[nftContract][tokenId] = listingCounter;

        emit AuctionCreated(
            listingCounter,
            nftContract,
            tokenId,
            msg.sender,
            startingPrice,
            block.timestamp + duration
        );
    }

    function placeBid(
        uint256 auctionId
    ) external payable {
        Auction storage auction = auctions[auctionId];

        require(auction.active, "Auction not active");
        require(block.timestamp < auction.endTime, "Auction has ended");
        require(msg.sender != auction.seller, "Cannot bid on your own auction");
        require(
            msg.value > auction.currentBid,
            "Bid must be higher than the current bid"
        );
        require(
            msg.value >= auction.startingPrice,
            "Bid is below the starting price"
        );

        if (auction.currentBidder != address(0)) {
            payable(auction.currentBidder).transfer(auction.currentBid);
        }

        auction.currentBid = msg.value;
        auction.currentBidder = msg.sender;

        if (auction.endTime - block.timestamp < 10 minutes) {
            auction.endTime = block.timestamp + 10 minutes;
        }

        emit BidPlaced(auctionId, msg.sender, msg.value);
    }

    function endAuction(
        uint256 auctionId
    ) external payable {
        Auction storage auction = auctions[auctionId];

        require(auction.active, "Auction not active");
        require(block.timestamp >= auction.endTime, "Auction has not ended yet");

        auction.active = false;
        nftToAuction[auction.nftContract][auction.tokenId] = 0;

        if (auction.currentBidder != address(0)) {
            uint256 fee = (auction.currentBid * marketplaceFee) / 10000;
            uint256 sellerAmount = auction.currentBid - fee;

            IERC721(auction.nftContract).safeTransferFrom(
                auction.seller,
                auction.currentBidder,
                auction.tokenId
            );

            payable(auction.seller).transfer(sellerAmount);

            emit AuctionEnded(
                auctionId,
                auction.currentBidder,
                auction.currentBid
            );
        } else {
            emit AuctionEnded(auctionId, address(0), 0);
        }
    }

    // Offer System
    function makeOffer(
        address nftContract,
        uint256 tokenId,
        uint256 expiration
    ) external payable {
        require(msg.value > 0, "Offer must be > 0");
        require(
            expiration > block.timestamp,
            "Expiration must be in the future"
        );
        require(
            expiration <= block.timestamp + 30 days,
            "Expiration is too far"
        );
        require(
            IERC721(nftContract).ownerOf(tokenId) != msg.sender,
            "Cannot make offer on your own NFT"
        );

        offerCounter++;

        offers[offerCounter] = Offer({
            offerId: offerCounter,
            nftContract: nftContract,
            tokenId: tokenId,
            buyer: msg.sender,
            amount: msg.value,
            expiration: expiration,
            active: true
        });

        nftToOffer[nftContract][tokenId].push(offerCounter);

        emit OfferCreated(
            offerCounter,
            nftContract,
            tokenId,
            msg.sender,
            msg.value,
            expiration
        );
    }

    function acceptOffer(uint256 offerId) external {
        Offer storage offer = offers[offerId];
        require(offer.active, "Offer is not active");
        require(offer.expiration >= block.timestamp, "Offer has expired");
        require(
            IERC721(offer.nftContract).ownerOf(offer.tokenId) == msg.sender,
            "You don't own the NFT"
        );
        uint256 fee = (offer.amount * marketplaceFee) / 10000;
        uint256 sellerAmount = offer.amount - fee;

        offer.active = false;

        IERC721(offer.nftContract).safeTransferFrom(
            msg.sender,
            offer.buyer,
            offer.tokenId
        );

        payable(msg.sender).transfer(sellerAmount);

        emit OfferAccepted(offer.offerId);
    }

    function cancelOffer(uint256 offerId) external {
        Offer storage offer = offers[offerId];
        require(offer.active, "Offer is not active");
        require(msg.sender == offer.buyer, "Not your offer");

        offer.active = false;

        payable(msg.sender).transfer(offer.amount);

        emit OfferCancelled(offer.offerId);
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

    function getOffersForNFT(
        address nftContract,
        uint256 tokenId
    ) external view returns (Offer[] memory) {
        uint256[] memory offerIds = nftToOffer[nftContract][tokenId];
        uint256 activeCount = 0;

        for (uint256 i = 0; i < offerIds.length; i++) {
            if (
                offers[offerIds[i]].active &&
                block.timestamp <= offers[offerIds[i]].expiration
            ) {
                activeCount++;
            }
        }

        Offer[] memory results = new Offer[](activeCount);
        uint256 resultCount = 0;

        for (
            uint256 i = 0;
            i <= offerIds.length && resultCount < activeCount;
            i++
        ) {
            if (
                offers[offerIds[i]].active &&
                block.timestamp <= offers[offerIds[i]].expiration
            ) {
                results[resultCount] = offers[offerIds[i]];
                resultCount++;
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

    function getOfferOfUser(
        address user
    ) external view returns (Offer[] memory) {
        uint256 activeCount = 0;

        for (uint256 i = 0; i < offerCounter; i++) {
            if (
                offers[i].active &&
                block.timestamp <= offers[i].expiration &&
                offers[i].buyer == user
            ) {
                activeCount++;
            }
        }

        Offer[] memory results = new Offer[](activeCount);
        uint256 resultCount = 0;

        for (
            uint256 i = 0;
            i <= offerCounter && resultCount < activeCount;
            i++
        ) {
            if (
                (offers[i].active &&
                    block.timestamp <= offers[i].expiration &&
                    offers[i].buyer == user)
            ) {
                results[resultCount] = offers[i];
                resultCount++;
            }
        }

        return results;
    }
}