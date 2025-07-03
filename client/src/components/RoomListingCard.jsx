function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function formatAgeRange(min, max) {
  return min === max ? `${min}` : `${min} - ${max}`;
}

function RoomListingCard(props) {
    console.log("Photos array:", props.photos);
    return (
        <div className="listingCard">
            <div className="photos">
                {props.photos.map((url, i) => (
                    <img key={i} src={`http://localhost:3000/images/${url}`} alt={`Photo ${i + 1}`} className={`photo photo-${i}`}/>
                ))}
            </div>
            <div className="rent">
                <h3>£{props.rent} pcm</h3>
            </div>
            <div className="furtherInfo">
                <ul className="listingUl">
                    <li className="listing"><strong>Move in date:</strong> {formatDate(props.move_in_date_min)} - {formatDate(props.move_in_date_max)}</li>
                    <li className="listing"><strong>Location: </strong>{props.location}</li>
                    <li className="listing"><strong>Age of current flatmates:</strong> {formatAgeRange(props.age_range_min, props.age_range_max)}</li>
                    <li className="listing"><strong>Women only household: </strong>{props.women_only_household === 1 ? 'Yes' : 'No'} </li> 
                    <li className="listing"><strong>LGBTQ+ only household:</strong> {props.lgbtq_only_household === 1 ? 'Yes' : 'No'} </li> 
                </ul>
            </div>
            <div className="longDescription">
                <p>{props.description}</p>
            </div>
        </div>
    )
}

export default RoomListingCard