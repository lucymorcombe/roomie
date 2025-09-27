import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RoomListingCard from '../components/RoomListingCard';
import ProfileCard from '../components/ProfileCard';

export default function Profile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [listing, setListing] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/users/${userId}/profile`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    }

    async function fetchListing() {
      try {
        // Fetch room listings with includeOwn parameter
        const roomRes = await fetch(`/api/room-listings?includeOwn=true`, { credentials: 'include' });
        const roomData = roomRes.ok ? await roomRes.json() : [];
        const roomListing = Array.isArray(roomData) ? roomData.find(l => l.user_id === Number(userId)) : null;

        if (roomListing) {
          setListing(roomListing);
          return;
        }

        // Fetch flatmate listings with includeOwn parameter
        const flatmateRes = await fetch('/api/flatmate-listings?includeOwn=true', { credentials: 'include' });
        const flatmateData = flatmateRes.ok ? await flatmateRes.json() : [];
        const flatmateListing = Array.isArray(flatmateData) ? flatmateData.find(l => l.user_id === Number(userId)) : null;

        if (flatmateListing) {
          setListing(flatmateListing);
          return;
        }

        setListing(null); // No listing found
      } catch (err) {
        console.error('Error fetching listing:', err);
      }
    }

    fetchUser();
    fetchListing();
  }, [userId]);

  if (!user) return <p>Loading user...</p>;
  
  return (
    <div className='profileListing'>
      <h1>{user.first_name} {user.last_name}</h1>
        <ProfileCard
            profilePicture={user.profilePicture}
            firstName={user.firstName}
            lastName={user.lastName}
            dob={user.dob}
            bio={user.bio}
            pronouns={user.pronouns}
            pronounsVisible={user.pronounsVisible}
            occupation={user.occupation}
            occupationVisible={user.occupationVisible}
            studentStatus={user.studentStatus}
            studentStatusVisible={user.studentStatusVisible}
            petOwner={user.petOwner}
            smokerStatus={user.smokerStatus}
            lgbtqIdentity={user.lgbtqIdentity}
            lgbtqIdentityVisible={user.lgbtqIdentityVisible}
            genderIdentity={user.genderIdentity}
            genderIdentityVisible={user.genderIdentityVisible}
            />

      {listing ? (
        <RoomListingCard {...listing} />
      ) : (
        <p>No listing available</p>
      )}
    </div>
  );
}