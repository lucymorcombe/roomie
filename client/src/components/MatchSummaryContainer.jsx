// MatchSummaryContainer.js
import React, { useState, useEffect } from "react";
import MatchSummaryCard from "./MatchSummaryCard";

function MatchSummaryContainer() {
    const [listings, setListings] = useState([]); 

    useEffect(() => {
        fetch("/api/matches")
            .then(res => res.json())
            .then(data => {
                console.log("matches fetched:", data);
                setListings(data);
            })
            .catch(err => console.error("Error fetching matches:", err));
    }, []);

    return (
        <div className="matchSummaryContainer">
            {listings.map(listing => (
                <MatchSummaryCard key={listing.listing_id} {...listing} />
            ))}
        </div>
    )
}

export default MatchSummaryContainer;
