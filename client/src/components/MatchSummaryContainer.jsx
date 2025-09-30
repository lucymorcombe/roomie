import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MatchSummaryCard from "./MatchSummaryCard";

function MatchSummaryContainer() {
    const [listings, setListings] = useState([]); 

    useEffect(() => {
        fetch("/api/matches")
            .then(res => res.json())
            .then(data => {
            console.log("matches fetched:", data);
            if (data.length > 0) {
                console.log("first match object:", data[0]);
            }
            setListings(data);
            })
            .catch(err => console.error("Error fetching matches:", err));
        }, []);

    return (
        <div className="matchSummaryContainer">
            {listings.map(listing => (
                console.log('Link userId:', listing.userId, 'Listing object:', listing),
                <Link
                    key={listing.userId}
                    to={`/profile/${listing.userId}`}
                    className="match-link"
                >
                    <MatchSummaryCard key={listing.listing_id} {...listing} />
                </Link>
            ))}
        </div>
    )
}

export default MatchSummaryContainer;
