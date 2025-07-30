import React, { useState, useEffect } from "react";
import RoomListingCard from "./RoomListingCard";
import LikeButton from "./LikeButton";
import DislikeButton from "./DislikeButton";

function RoomListingsContainer() {
    const [listings, setListings] = React.useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); //state for current index
    const [listingType, setListingType] = useState(null);
    const fakeUserId = 1;


    React.useEffect(() => {
        const fetchListings = async () => {
            try{
                const listingTypeResponse = await fetch(`/api/users/${fakeUserId}/listing-type`);
                const {listingType} = await listingTypeResponse.json();

                setListingType(listingType);

                let listingUrl = '';
                if (listingType === 'hasRoom') {
                    listingUrl = '/api/flatmate-listings';
                } else if (listingType === 'needsRoom') {
                    listingUrl = '/api/room-listings';
                } else {
                    throw new Error('Unknown listing type');
                }

                const listingsResponse = await fetch(listingUrl);
                if (!listingsResponse.ok) {
                    throw new Error(`HTTP error! status: ${listingsResponse.status}`);
                }
                const listingsData = await listingsResponse.json();
                console.log("Listings fetched:", listingsData);
                setListings(listingsData);
                
            } catch (error) {
                console.error("Error fetching Roomie Picks:", error)
            }

            };

            fetchListings();
        }, []);


///////this is my previous stuff from before. above is mya ttempt to fix.  im just not sure how to merge them
    function handleYes() {
        const currentListing = listings[currentIndex];
        console.log("Liked listing:", currentListing);

        handleLike(currentListing.user_id, true); // Send like
        setCurrentIndex(i => (i + 1 < listings.length ? i + 1 : i));
    }

    function handleNo() {
        const currentListing = listings[currentIndex];
        console.log("Disliked listing:", currentListing);

        handleLike(currentListing.user_id, false); // Send dislike
        setCurrentIndex(i => (i + 1 < listings.length ? i + 1 : i));
    }

    const handleLike = async (likedUserId, isLiked) => {
        try {
            await fetch('/api/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    likerId: fakeUserId,
                    likedUserId,
                    liked: isLiked,
                }),
            });
            console.log(`Sent ${isLiked ? "like" : "dislike"} for user ${likedUserId}`);
        } catch (err) {
            console.error('Error saving like:', err);
        }
    };



    if (!listingType) {
        return <p>Loading listings...</p>; 
    }

    if (listings.length === 0) {
        return <p>No more listings available. Try again later!</p>;
    }

    
    return (
        <>
        <div>
            <RoomListingCard {...listings[currentIndex]} listingType={listingType} />
            <DislikeButton onClick={handleNo} />
            <LikeButton onClick={handleYes} />
            {/* {listings.map(listing => (
                <RoomListingCard key={listing.room_id} {...listing} />
            ))}
            <DislikeButton/>
            <LikeButton/> */}
            <p className="helpSheet"><a>How does this work?</a></p>
        </div>
        </>
    )
}

export default RoomListingsContainer