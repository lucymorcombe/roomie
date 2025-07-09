import React, { useState, useEffect } from "react";
import RoomListingCard from "./RoomListingCard";
import LikeButton from "./LikeButton";
import DislikeButton from "./DislikeButton";

function RoomListingsContainer() {
    const [listings, setListings] = React.useState([]);

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

    return (
        <>
        <div>
            {listings.map(listing => (
                <RoomListingCard key={listing.room_id} {...listing} />
            ))}
            <DislikeButton/>
            <LikeButton/>
            <p className="helpSheet"><a>How does this work?</a></p>
        </div>
        </>
    )
}

export default RoomListingsContainer