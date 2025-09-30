import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MatchSummaryCard from "./MatchSummaryCard";
import LikeButton from "./LikeButton";

function LikeSummaryContainer() {
    const [listings, setListings] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await fetch("/api/session", { credentials: "include" });
                const data = await res.json();
                if (data.loggedIn) setCurrentUserId(data.userId);
            } catch (err) {
                console.error("Error fetching current user:", err);
            }
        };
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        fetch("/api/likes")
            .then(res => res.json())
            .then(data => {
                console.log("Likes fetched", data);
                setListings(data);
            })
            .catch(err => console.error("Error fetching likes:", err));
    }, []);

    const handleLike = async (likedUserId) => {
        if (!currentUserId) return;
        try {
            const res = await fetch("/api/like", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    likerId: currentUserId,
                    likedUserId,
                    liked: true,
                }),
            });
            if (!res.ok) throw new Error("Failed to save like");

            setListings(prev => prev.filter(l => l.user_id !== likedUserId));
        } catch (err) {
            console.error("Error liking user:", err);
        }
    };

    return (
        <div className="matchSummaryContainer">
            {listings.map(listing => (
                <div key={listing.user_id} className="like-card-wrapper">
                    <Link
                        key={listing.user_id}
                        to={`/profile/${listing.user_id}`}  
                        className="match-link"
                    >
                    <MatchSummaryCard key={listing.listing_id} {...listing} />
                    </Link>
                    <LikeButton onClick={() => handleLike(listing.user_id)} />
                </div>
            ))}
        </div>
    )
}

export default LikeSummaryContainer;
