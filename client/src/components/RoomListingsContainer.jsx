import React, { useState, useEffect } from "react";
import RoomListingCard from "./RoomListingCard";
import LikeButton from "./LikeButton";
import DislikeButton from "./DislikeButton";

function RoomListingsContainer() {
    const [listings, setListings] = React.useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); //state for current index


    React.useEffect(() => {
        console.log("Fetching listings...");
        fetch("/listings")
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
        console.log("Liked listing:", listings[currentIndex]);
        setCurrentIndex(i => {
            const newIndex = (i + 1 < listings.length ? i + 1 : i);
            console.log("Advancing index:", newIndex);
            return newIndex;
        });
    }

    function handleNo() {
        console.log("Disliked listing:", listings[currentIndex]);
        setCurrentIndex(i => {
            const newIndex = (i + 1 < listings.length ? i + 1 : i);
            console.log("Advancing index:", newIndex);
            return newIndex;
        });
    }


    if (listings.length === 0) return <div>Loading listings...</div>;

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