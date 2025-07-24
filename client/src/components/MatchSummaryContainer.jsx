import React, { useState, useEffect } from "react";
import MatchSummaryCard from "./MatchSummaryCard";

function MatchSummaryContainer() {
    const [listings, setListings] = useState([]); 

    React.useEffect(() => {
            console.log("Fetching listings...");
            fetch("/api/matches")
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
                    console.log("matches fetched:", data);
                    setListings(data);
                })
                .catch(err => {
                    console.error("Error fetching matches:", err);
                });
        }, []);

    return(
        <div className="matchSummaryContainer">
            {listings.map((listing) => (
                <MatchSummaryCard key={listing.room_id} {...listing} />
            ))}
        </div>
    )
}

export default MatchSummaryContainer