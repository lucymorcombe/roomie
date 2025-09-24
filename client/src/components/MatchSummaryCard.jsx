function MatchSummaryCard(props) {
    const formatDate = (dateString) => {
        if (!dateString) return null; // no date available
        const date = new Date(dateString);
        if (isNaN(date)) return null; // invalid date
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const moveInDate = formatDate(props.move_in_date_min);

    return (
        <div className="matchSummaryCard">
            <div className="matchImgAndPrice">
                <img src={`http://localhost:3000/images/${props.first_photo}`} alt="Listing photo" />
            </div>
            <div className="matchQuickInfo">
                <h3>{props.first_name}</h3>

                {props.rent !== undefined ? (
                    <>
                        <h4>
                            Property in {props.location}
                            {moveInDate ? `. Available from ${moveInDate}` : ''}
                        </h4>
                        <h4>£{props.rent}pcm</h4>
                        <p>{props.description?.slice(0, 200)}{props.description?.length > 200 ? "..." : ""}</p>
                    </>
                ) : (
                    <>
                        <h4>
                            Looking for property in {props.location}
                            {moveInDate ? `. Needs to move: ${moveInDate}` : ''}
                        </h4>
                        <h4>Budget: up to £{props.budget_max}pcm</h4>
                        <p>{props.description?.slice(0, 200)}{props.description?.length > 200 ? "..." : ""}</p>
                    </>
                )}

                {props.matched_at && (
                    <p>Matched on: {formatDate(props.matched_at) || 'TBC'}</p>
                )}
            </div>
        </div>
    )
}

export default MatchSummaryCard;
