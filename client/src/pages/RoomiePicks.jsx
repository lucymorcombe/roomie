import { useState, useEffect } from "react";
import RoomListingsContainer from "../components/RoomListingsContainer";
import ProfileCard from "../components/ProfileCard";

function RoomiePicks() {
  const [currentListing, setCurrentListing] = useState(null);
  const [listingUser, setListingUser] = useState(null);

  // Fetch the user for the current listing
  useEffect(() => {
    if (!currentListing?.user_id) {
      setListingUser(null);
      return;
    }

    async function fetchUser() {
      try {
        const res = await fetch(
          `/api/users/${currentListing.user_id}/profile`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setListingUser(data);
      } catch (err) {
        console.error("Error fetching listing user:", err);
        setListingUser(null);
      }
    }

    fetchUser();
  }, [currentListing]);

  return (
    <>
      <div className="roomiePicksIntro">
        <h1>Roomie Picks</h1>
        <p>
          Your Roomie Picks are here! We’ve lined them up so the top listings
          are generally your best matches, with compatibility easing a little
          further down. But don’t scroll past the rest — you never know who
          might surprise you. Take a peek, swipe through, and discover your
          next great flatmate!
        </p>
      </div>

      <RoomListingsContainer onChangeListing={setCurrentListing} />
        
      {listingUser && (
        <div className="picksProfile">
        <ProfileCard
          profilePicture={listingUser.profilePicture || ""}
          firstName={listingUser.firstName || ""}
          lastName={listingUser.lastName || ""}
          dob={listingUser.dob || ""}
          bio={listingUser.bio || ""}
          pronouns={listingUser.pronouns || ""}
          pronounsVisible={listingUser.pronounsVisible || false}
          occupation={listingUser.occupation || ""}
          occupationVisible={listingUser.occupationVisible || false}
          studentStatus={listingUser.studentStatus || 0}
          studentStatusVisible={listingUser.studentStatusVisible || false}
          petOwner={listingUser.petOwner ?? null}
          smokerStatus={listingUser.smokerStatus ?? null}
          lgbtqIdentity={listingUser.lgbtqIdentity ?? 0}
          lgbtqIdentityVisible={listingUser.lgbtqIdentityVisible || false}
          genderIdentity={listingUser.genderIdentity || ""}
          genderIdentityVisible={listingUser.genderIdentityVisible || false}
        />
        </div>
      )}
    </>
  );
}

export default RoomiePicks;
