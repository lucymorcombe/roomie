import profileIcon from "../assets/profileIcon.png";
import listingIcon from "../assets/listingIcon.png";
import formIcon from "../assets/formIcon.png";
import homeImage from "../assets/homeImage.jpg";
import matchGraphic from "../assets/matchGraphic.jpg";

function HomePage() {
    return (
        <>
        <div className="homepageBanner">
            <img className="bannerImg" src={homeImage} alt="Two women moving house surrounded by boxes. One woman is sat in a box with limbs flailing and smiling, the other is pushing her around."/>
        <div className="bannerText">
        <h1> Welcome to Roomie!</h1>
        <h2>Find your perfect flatmate.</h2>
            <p>Tired of messy housemates, late rent, or totally clashing lifestyles? Roomie makes finding your ideal flatmate or room simple, fun, and stress-free. Whether you’re looking for a room or offering one, we match you with people who actually get your vibe.</p><br/><br/>
            <a href="#howItWorks" class="scrollButton">See how it works &#129055;</a>
        </div>
        </div>
        <div className="howItWorks" id="howItWorks">
            <h3>How It Works</h3>
            <div className="howItWorksFlex">
                <div className="stage1">
                    <p className="howHeading">Create Your Profile</p>
                    <img src={profileIcon} alt="Pink profile icon"/>
                    <p>Tell us about yourself – your lifestyle, habits, and what matters to you in a home.</p>
                </div>
                <div className="stage2">
                    <p className="howHeading">Add a Listing</p>
                    <img src={listingIcon} alt="Pink profile icon"/>
                    <p>Add your room or flatmate details – photos, rent, move-in date, and what you’re looking for.</p>
                </div>
                <div className="stage2">
                    <p className="howHeading">Roomie Questionnaire</p>
                    <img src={formIcon} alt="Pink profile icon"/>
                    <p>Answer a few quick questions so we can match you with people who share your habits, values, and quirks.</p>
                </div>
            </div>
            <br/>
            <p className="nextSteps">Then, once your profile and listing are ready, you can start browsing compatible users and find your perfect match - <span className="greenAccentBold">no more awkward living situations or wasted viewings.</span></p><br/>
            <a href="#CTAContainer" class="scrollButton">Get started &#129055;</a>
            
        </div>
        <div className="CTAContainer" id="CTAContainer">
            <h3 className="inverted">Ready to meet your ideal flatmate?</h3>
            <p className="CTAIntro">Don’t waste another day with mismatched housemates – <span className="greenAccentBold">dive in and find your perfect Roomie</span></p>
            <div className="CTA">
                <a href="/get-started" className="CTAOption loginOption">
                    <div className="CTAText">
                        <h4>I'm ready to browse!</h4>
                        <p>Login and see your compatible matches</p>
                    </div>
                    <img className="CTAImage" src={matchGraphic} alt="illustration of computer screen with a heart in the middle"/>
                </a>
                <a href="/get-started"className="CTAOption registerOption">
                    <div className="CTAText">
                        <h4>Let's get started!</h4>
                        <p>Register and create your profile</p>
                    </div>
                    <img className="CTAImage" src={matchGraphic} alt="illustration of computer screen with a heart in the middle"/>
                </a>
            </div>
            <a href="#" class="scrollButton">Back to top &#129053;</a>
        </div>
        </>
    )
}

export default HomePage