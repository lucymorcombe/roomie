function RoomListingCard(props) {
    return (
        <>
            <div className="photos">
                {props.photos.map((url, i) => (
                    <img key={i} src={url} alt={`Photo ${i + 1}`} />
                ))}
            </div>
            <div className="rent">
                <p>{props.rent}</p>
            </div>
            <div className="furtherInfo">
                <ul>
                    <li>Move in date: {props.move_in_date_min} - {props.move_in_date_max}</li>
                    <li>Location: {props.location}</li>
                    <li>Age range: {props.age_range_min} - {props.age_range_max}</li>
                    <li>Women only household: {props.women_only_household} </li> 
                    <li>LGBTQ+ only household: {props.lgbtq_only_household} </li> 
                </ul>
            </div>
            <div className="longDescription">
                <p>{props.description}</p>
            </div>
        </>
    )
}

export default RoomListingCard