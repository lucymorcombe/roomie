function ProfileCard(props) {
  // Function to calculate age from dob
  function calculateAge(dob) {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  const age = calculateAge(props.dob);

  return (
    <div className="profileCard">
      {props.profilePicture && (
        <img
          src={`http://localhost:3000${props.profilePicture}`}
          alt={`${props.firstName}'s profile`}
          className="profilePicture"
        />
      )}
      <div className="profileInfo">
        <div className="row1">
          <h3>
            {props.firstName}{' '}{props.lastName ? props.lastName[0] : ''}{age !== null ? `, ${age}` : ''}
          </h3>

          {props.pronouns && props.pronounsVisible && (
            <p>{props.pronouns}</p>
          )}

        </div>

        <div className="row2">
          <p>{props.bio}</p>
        </div>

        <div className="row3">

          {props.occupationVisible && (
            <p>• {props.occupation}</p>
          )}

          {props.studentStatusVisible && (
            <p>• Student? <span className="tickCross">{props.studentStatus ? '✔' : '✖'}</span></p>
          )}

          {props.petOwner !== null && (
            <p>• Pets? <span className="tickCross">{props.petOwner ? '✔' : '✖'}</span></p>
          )}

          <p>• Smokes/Vapes? <span className="tickCross">{props.smokerStatus ? '✔' : '✖'}</span></p>

          {props.lgbtqIdentityVisible && (
            <p>• LGBTQ+? <span className="tickCross">{props.lgbtqIdentity === 1 ? '✔' : '✖'}</span></p>
          )}

          {props.genderIdentityVisible && (
            <p>• {props.genderIdentity}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
