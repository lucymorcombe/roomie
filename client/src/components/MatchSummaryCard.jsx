function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function MatchSummaryCard(props) {
    console.log("MatchSummaryCard props:", props);
    return (
        <div className="matchSummaryCard">
            <div className="matchImgAndPrice">
            <img src={`http://localhost:3000/images/${props.first_photo}`} alt="Listing photo" />
            </div>
            {props.rent !== undefined ? (
              <div className="matchQuickInfo">
                <h4>Property in {props.location}. Available from {formatDate(props.move_in_date_min)}</h4>
                <h4>£{props.rent}pcm</h4>
                <p>{props.description.slice(0, 200)}{props.description.length > 200 ? "..." : ""}</p>
              </div>
            ) : (
              <div className="matchQuickInfo">
                <h4>Looking for property in {props.location}. Needs to move: {formatDate(props.move_in_date_min)}</h4>
                <h4>Budget: up to £{props.budget_max}pcm</h4>
                <p>{props.description.slice(0, 200)}{props.description.length > 200 ? "..." : ""}</p>
              </div>
            )}
            <p>{formatDate(props.matched_at)}</p>
        </div>
    )
}

export default MatchSummaryCard