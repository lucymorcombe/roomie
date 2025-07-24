import React, { useState, useEffect } from "react";
import RoomListingCard from "./RoomListingCard";
import LikeButton from "./LikeButton";
import DislikeButton from "./DislikeButton";

function RoomListingsContainer() {
    const [listings, setListings] = React.useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); //state for current index
    const fakeUserId = 11;


    React.useEffect(() => {
        console.log("Fetching listings...");
        fetch("/api/room-listings")
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const contentType = res.headers.get("content-type") || "";
                if (!contentType.includes("application/json")) {
                    throw new Error(`Expected JSON but got ${contentType}`);
                }
                return res.json();
            })
            .then(data => {
                console.log("Listings fetched:", data);
                setListings(data);
            })
            .catch(err => {
                console.error("Error fetching listings:", err);
            });
    }, []);

    console.log("Current listings state:", listings);

    // function handleYes() {
    //     console.log("Liked listing:", listings[currentIndex]);
    //     // TODO: send like info to server if needed
    //     setCurrentIndex(i => (i + 1 < listings.length ? i + 1 : i));
    // }

    // function handleNo() {
    //     console.log("Disliked listing:", listings[currentIndex]);
    //     // TODO: send dislike info to server if needed
    //     setCurrentIndex(i => (i + 1 < listings.length ? i + 1 : i));
    // }

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



    if (listings.length === 0) {
    return (
        <div>
        <p>No more listings available. Try again later!</p>
        </div>
    );
    }
    
    return (
        <>
        <div>
            <RoomListingCard {...listings[currentIndex]} />
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