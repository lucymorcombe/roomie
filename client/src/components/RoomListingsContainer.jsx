import React, { useState, useEffect } from "react";
import RoomListingCard from "./RoomListingCard";
import LikeButton from "./LikeButton";
import DislikeButton from "./DislikeButton";
import { useMediaQuery } from "react-responsive";
import SwipeStack from "./SwipeStack";

function RoomListingsContainer({ onChangeListing, showProfileButton }) { 
    const [listings, setListings] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0);
    const [listingType, setListingType] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const isMobile = useMediaQuery({ maxWidth: 768 });

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

    useEffect(() => {
        const activeIndex = isMobile ? currentSwipeIndex : currentIndex;
        if (listings[activeIndex] && onChangeListing) {
            onChangeListing(listings[activeIndex]);
        }
    }, [currentIndex, currentSwipeIndex, isMobile, listings, onChangeListing]);

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
                    currentIndex < listings.length ? (
                        <>
                            <SwipeStack
                                listings={listings}
                                onLike={(listing) => handleLike(listing.user_id, true)}
                                onDislike={(listing) => handleLike(listing.user_id, false)}
                                onIndexChange={setCurrentSwipeIndex}
                            />
                            {showProfileButton && listings[currentSwipeIndex] && (
                                <button 
                                    onClick={() => window.location.href = `/profile/${listings[currentSwipeIndex].user_id}`}
                                    className="viewProfileButton"
                                    style={{
                                        width: '90%',
                                        marginLeft: '5%',
                                        padding: '12px',
                                        marginTop: '20px',
                                        backgroundColor: '#2EE895',
                                        color: '#000',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        fontWeight: '600'
                                    }}
                                >
                                    View Profile
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="noMoreProfiles">
                            <h2>No more profiles to swipe!</h2>
                            <p>Please check back later.</p>
                        </div>
                    )
                ) : (
                    <>
                        {currentIndex < listings.length ? (
                            <>
                                <RoomListingCard 
                                    {...listings[currentIndex]} 
                                    listingType={listingType}
                                    showProfileButton={showProfileButton}
                                    userId={listings[currentIndex].user_id}
                                />
                                <DislikeButton onClick={handleNo} />
                                <LikeButton onClick={handleYes} />
                            </>
                        ) : (
                            <div className="noMoreProfiles">
                                <h2>No more profiles to swipe!</h2>
                                <p>Please check back later.</p>
                            </div>
                        )}
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
                                These are the profiles our algorithm thinks could be your ideal flatmates. Maybe you both love making friends, maybe you're happy just waving hello in the kitchen—whatever your vibe, we've got you covered.
                                <br /><br />
                                You'll also see some less compatible matches, but don't worry, we'll never show anyone in your dealbreaker categories.
                                <br /><br />
                                Swipe left, swipe right… looks familiar, right? Don't worry, no awkward first dates here.
                                <br /><br />
                                <strong>On mobile:</strong> Tap a listing for more info, then swipe right if you like them or left if not.
                                <br />
                                <strong>On desktop:</strong> Use the heart to like, or the X to pass on a profile.
                                <br /><br />
                                When you get a match, you'll get a little notification. Check Likes for people who liked you, and Matches for all your matches.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default RoomListingsContainer;