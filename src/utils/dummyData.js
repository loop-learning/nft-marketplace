export const generateDummyAuctions = () => {
    const collections = [
        "Anichess Ethernals",
        "Crypto Punks",
        "Bored Ape Yacht Club",
        "Azuki",
        "Doodles",
    ];

    const categories = ["Art", "Gaming", "Music", "Sports", "Utility"];

    const auctions = [];
    for (let i = 1; i <= 20; i++) {
        const collection = collections[Math.floor(Math.random() * collections.length)];
        const startingPrice = (Math.random() * 5 + 0.1).toFixed(3);
        const currentBid = (parseFloat(startingPrice) * (1.2 + Math.random() * 0.8)).toFixed(3);
        const endTime = new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000); // Next 7 days

        auctions.push({
            id: i,
            name: `${collection} #${i}`,
            collection: collection,
            startingPrice: startingPrice,
            currentBid: currentBid,
            image: `https://picsum.photos/400/400?random=${i + 100}`,
            category: categories[Math.floor(Math.random() * categories.length)],
            seller: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
            currentBidder: Math.random() > 0.3 ? `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}` : null,
            tokenId: i,
            contractAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
            endTime: endTime,
            isActive: endTime > new Date(),
            bidCount: Math.floor(Math.random() * 15) + 1,
            description: `This is a unique NFT from the ${collection} collection currently up for auction.`,
            // NFT Card compatibility fields
            price: currentBid, // Use current bid as "price" for card display
            owner: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
            lastSale: (parseFloat(currentBid) * 0.8).toFixed(3), // Previous sale price
            chain: "Ethereum",
            // Auction-specific identifier
            isAuction: true,
            auctionId: i,
            traits: [
                {
                    trait_type: "Background",
                    value: ["Blue", "Green", "Purple", "Red", "Yellow"][Math.floor(Math.random() * 5)],
                },
                {
                    trait_type: "Eyes",
                    value: ["Normal", "Laser", "3D", "Heartshape", "X"][Math.floor(Math.random() * 5)],
                },
            ],
        });
    }
    return auctions;
};


export const generateDummyNFTs = () => {
    const collections = [
        "Anichess Ethernals",
        "Crypto Punks",
        "Bored Ape Yacht Club",
        "Mutant Ape Yacht Club",
        "Azuki",
        "Doodles",
        "Cool Cats",
        "World of Women",
    ];

    const categories = ["Art", "Gaming", "Music", "Sports", "Utility"];
    const chains = ["Ethereum", "Polygon", "Solana"];

    const nfts = [];
    for (let i = 1; i <= 150; i++) {
        const collection =
            collections[Math.floor(Math.random() * collections.length)];
        const price = (Math.random() * 10 + 0.1).toFixed(3);
        const lastSale = (parseFloat(price) * (0.7 + Math.random() * 0.6)).toFixed(
            3
        );

        nfts.push({
            id: i,
            name: `${collection} #${i}`,
            collection: collection,
            price: price,
            lastSale: lastSale,
            image: `https://picsum.photos/400/400?random=${i}`,
            category: categories[Math.floor(Math.random() * categories.length)],
            owner: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random()
                .toString(16)
                .substr(2, 4)}`,
            tokenId: i,
            contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
            chain: chains[Math.floor(Math.random() * chains.length)],
            description: `This is a unique NFT from the ${collection} collection. Each piece is carefully crafted with attention to detail.`,
            traits: [
                {
                    trait_type: "Background",
                    value: ["Blue", "Green", "Purple", "Red", "Yellow"][
                        Math.floor(Math.random() * 5)
                    ],
                },
                {
                    trait_type: "Eyes",
                    value: ["Normal", "Laser", "3D", "Heartshape", "X"][
                        Math.floor(Math.random() * 5)
                    ],
                },
                {
                    trait_type: "Mouth",
                    value: ["Smile", "Frown", "Surprised", "Neutral"][
                        Math.floor(Math.random() * 4)
                    ],
                },
            ],
        });
    }
    return nfts;
};