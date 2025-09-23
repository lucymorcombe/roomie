function LikeButton({onClick}) {
    return (
        <>
        <div className="likeButton" onClick={onClick} >
            <p>{String.fromCharCode(0x2665)}</p>
        </div>
        </>
    )
}

export default LikeButton