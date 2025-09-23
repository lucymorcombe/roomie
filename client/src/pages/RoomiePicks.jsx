import RoomListingsContainer from "../components/RoomListingsContainer"

function RoomiePicks() {
    return (
        <>
        <div className="roomiePicksIntro">
            <h1>Roomie Picks</h1>
            <p>Your Roomie Picks are here! We’ve lined them up so the top listings are generally your best matches, with compatibility easing a little further down. But don’t scroll past the rest — you never know who might surprise you. Take a peek, swipe through, and discover your next great flatmate!</p>
        </div>
        <RoomListingsContainer />
        </>
    )
}

export default RoomiePicks