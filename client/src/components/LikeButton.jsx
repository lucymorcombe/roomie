function LikeButton({onClick}) {
    return (
        <>
        <div className="likeButton" onClick={onClick} >
            <p>{String.fromCharCode(9829)}</p>
        </div>
        </>
    )
}

export default LikeButton