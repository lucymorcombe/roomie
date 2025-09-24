// LikeSummaryContainer.js
import React, { useState, useEffect } from "react";
import MatchSummaryCard from "./MatchSummaryCard";

function LikeSummaryContainer() {
    const [listings, setListings] = useState([]);

    useEffect(() => {
        fetch("/api/likes")
            .then(res => res.json())
            .then(data => {
                console.log("Likes fetched", data);
                setListings(data);
            })
            .catch(err => console.error("Error fetching likes:", err));
    }, []);

    return (
        <div className="matchSummaryContainer">
            {listings.map(listing => (
                <MatchSummaryCard key={listing.listing_id} {...listing} />
            ))}
        </div>
    )
}

export default LikeSummaryContainer;
