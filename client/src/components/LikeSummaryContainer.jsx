import React, { useState, useEffect } from "react";
import MatchSummaryCard from "./MatchSummaryCard";

function LikeSummaryContainer() {
    const [listings, setListings] = useState([]);

    React.useEffect(() => {
        console.log("Fetching listings...");
        fetch("/api/likes")
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
                console.log("Likes fetched", data);
                setListings(data);
            })
            .catch(err => {
                console.error("Error fetching likes:", err);
            });
    }, [])
    
    return(
        <div className="matchSummaryContainer">
            {listings.map((listing) => (
                <MatchSummaryCard key={listing.room_id} {...listing} />
            ))}
        </div>
    )
}

export default LikeSummaryContainer