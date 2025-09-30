import profileBackupIcon from '../assets/profileBackupIcon.png';

function MatchSummaryCard(props) {
    const formatDate = (dateString) => {
        if (!dateString) return null; 
        const date = new Date(dateString);
        if (isNaN(date)) return null; 
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
                <img 
                    src={`http://localhost:3000${props.first_photo}`} 
                    alt="Listing photo" 
                    onError={(e) => { e.target.onerror = null; e.target.src = profileBackupIcon; }}
                />
            </div>
            <div className="matchQuickInfo">

                {props.rent !== undefined && props.rent !== null ? (
                    <>
                        <div className="horizontalWrapper">
                        <h4>
                            {props.first_name}'s property in {props.location}
                            {moveInDate ? `. Available from ${moveInDate}` : ''}
                        </h4>
                        <h4 className="rent">£{props.rent}pcm</h4>
                        </div>
                        <p className="shortDesc">{props.description?.slice(0, 150)}{props.description?.length > 200 ? "..." : ""}</p>
                        
                    </>
                ) : (
                    <>
                        <h4>
                            {props.first_name}'s looking for property in {props.location}
                            {moveInDate ? ` from ${moveInDate}` : ''}
                        </h4>
                        {/* <p className="budget">Max budget: £{props.budget_max}pcm</p> */}
                        <p>{props.description?.slice(0, 150)}{props.description?.length > 200 ? "..." : ""}</p>
                    </>
                )}

                {props.matched_at && (
                    <p className="matchedOn">Matched: {formatDate(props.matched_at) || 'TBC'}</p>
                )}
            </div>
        </div>
    )
}

export default MatchSummaryCard;
