import React, { useState, useEffect } from "react";
import RoomListingCard from "./RoomListingCard";
import LikeButton from "./LikeButton";
import DislikeButton from "./DislikeButton";
import { useMediaQuery } from "react-responsive";
import SwipeStack from "./SwipeStack";

function RoomListingsContainer({ onChangeListing }) { 
    const [listings, setListings] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [listingType, setListingType] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Media query must be inside the component
    const isMobile = useMediaQuery({ maxWidth: 768 });

    // Fetch logged-in user session
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await fetch('/api/session', { credentials: 'include' });
                const data = await res.json();
                if (data.loggedIn) {
                    setCurrentUser({ id: data.userId });
                }
            } catch (err) {
                console.error('Error fetching current user:', err);
            }
        };
        fetchCurrentUser();
    }, []);

    // Fetch listings based on current user
    useEffect(() => {
        if (!currentUser) return;

        const fetchListings = async () => {
            try {
                const listingTypeResponse = await fetch(`/api/users/${currentUser.id}/listing-type`, { credentials: 'include' });
                const { listingType } = await listingTypeResponse.json();

                setListingType(listingType);

                let listingUrl = '';
                if (listingType === 'hasRoom') listingUrl = '/api/flatmate-listings';
                else if (listingType === 'needsRoom') listingUrl = '/api/room-listings';
                else throw new Error('Unknown listing type');

                const listingsResponse = await fetch(listingUrl + '?excludeSwiped=true', { credentials: 'include' });
                if (!listingsResponse.ok) throw new Error(`HTTP error! status: ${listingsResponse.status}`);

                const listingsData = await listingsResponse.json();
                setListings(listingsData);

                if (listingsData.length && onChangeListing) onChangeListing(listingsData[0]);
            } catch (error) {
                console.error("Error fetching Roomie Picks:", error)
            }
        };

        fetchListings();
    }, [currentUser, onChangeListing]);

    // Update the current listing when index changes
    useEffect(() => {
        if (listings[currentIndex] && onChangeListing) {
            onChangeListing(listings[currentIndex]);
        }
    }, [currentIndex, listings, onChangeListing]);

    const handleYes = () => {
        const currentListing = listings[currentIndex];
        handleLike(currentListing.user_id, true);
        setCurrentIndex(i => (i + 1 < listings.length ? i + 1 : i));
    };

    const handleNo = () => {
        const currentListing = listings[currentIndex];
        handleLike(currentListing.user_id, false);
        setCurrentIndex(i => (i + 1 < listings.length ? i + 1 : i));
    };

    const handleLike = async (likedUserId, isLiked) => {
        if (!currentUser) return;
        try {
            await fetch('/api/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    likerId: currentUser.id,
                    likedUserId,
                    liked: isLiked,
                }),
            });
        } catch (err) {
            console.error('Error saving like:', err);
        }
    };

    return (
        <>
            <div>
                {isMobile ? (
                    <SwipeStack
                        listings={listings}
                        onLike={(listing) => handleLike(listing.user_id, true)}
                        onDislike={(listing) => handleLike(listing.user_id, false)}
                    />
                ) : (
                    <>
                        {listings[currentIndex] && (
                            <RoomListingCard {...listings[currentIndex]} listingType={listingType} />
                        )}
                        <DislikeButton onClick={handleNo} />
                        <LikeButton onClick={handleYes} />
                    </>
                )}
            </div>

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
                            <p>
                                These are the profiles our algorithm thinks could be your ideal flatmates. Maybe you both love making friends, maybe you’re happy just waving hello in the kitchen—whatever your vibe, we’ve got you covered.
                                <br /><br />
                                You’ll also see some less compatible matches, but don’t worry, we’ll never show anyone in your dealbreaker categories.
                                <br /><br />
                                Swipe left, swipe right… looks familiar, right? Don’t worry, no awkward first dates here.
                                <br /><br />
                                <strong>On mobile:</strong> Tap a listing for more info, then swipe right if you like them or left if not.
                                <br />
                                <strong>On desktop:</strong> Use the heart to like, or the X to pass on a profile.
                                <br /><br />
                                When you get a match, you’ll get a little notification. Check Likes for people who liked you, and Matches for all your matches.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default RoomListingsContainer;
