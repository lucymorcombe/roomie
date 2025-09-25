// LikeSummaryContainer.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
                console.log('Link userId:', listing.user_id, 'Listing object:', listing),
                <Link
                    key={listing.user_id}
                    to={`/profile/${listing.user_id}`}  
                    className="match-link"
                >
                <MatchSummaryCard key={listing.listing_id} {...listing} />
                </Link>
            ))}
        </div>
    )
}

export default LikeSummaryContainer;
