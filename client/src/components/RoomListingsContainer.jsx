import React, { useState, useEffect } from "react";
import RoomListingCard from "./RoomListingCard";
import LikeButton from "./LikeButton";
import DislikeButton from "./DislikeButton";

function RoomListingsContainer() {
    const [listings, setListings] = React.useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); //state for current index
    const [listingType, setListingType] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);
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
                <div>
                <p className="helpSheet">
                    <a href="#" onClick={(e) => { e.preventDefault(); setShowOverlay(true); }}>
                        How does this work?
                    </a>
                </p>

                {showOverlay && (
                    <div className="overlay">
                        <div className="overlay-content">
                            <button
                                className="close-button"
                                onClick={() => setShowOverlay(false)}
                                >
                                ×
                            </button>
                            <h3>How does this work?</h3>
                            <p>These are the profiles our algorithm thinks could be your ideal flatmates. Maybe you both love making friends, maybe you’re happy just waving hello in the kitchen—whatever your vibe, we’ve got you covered.
                            <br/><br/>
                            You’ll also see some less compatible matches, but don’t worry, we’ll never show anyone in your dealbreaker categories.
                            <br/><br/>
                            Swipe left, swipe right… looks familiar, right? Don’t worry, no awkward first dates here.
                            <br/><br/>
                            <strong>On mobile:</strong> Tap a listing for more info, then swipe right if you like them or left if not.
                            <br/>
                            <strong>On desktop:</strong> Use the heart to like, or the X to pass on a profile.
                            <br/><br/>
                            When you get a match, you’ll get a little notification. Check Likes for people who liked you, and Matches for all your matches.</p>
                            </div>

                    </div>
                )}
                </div>
        </div>
        </>
    )
}

export default RoomListingsContainer