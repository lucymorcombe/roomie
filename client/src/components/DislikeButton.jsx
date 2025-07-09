function DislikeButton({onClick}) {
    return (
        <>
        <div className="dislikeButton" onClick={onClick} >
            <p>{String.fromCharCode(215)}</p>
        </div>
        </>
    )
}

export default DislikeButton

