import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const openModal = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="listingCard">
      <div className="photos">
        {(props.photos || []).map((url, i) => {
          if (i === 2 && props.photos.length > 3) {
            return (
              <div 
                key={i} 
                className="photo photo-2 see-more"
                style={{ cursor: 'pointer' }}
                onClick={() => openModal(i)}
              >
                <img
                  src={`http://localhost:3000${url}`}
                  alt={`Photo ${i + 1}`}
                />
                <span className="see-more-text">See more</span>
              </div>
            );
          }

          return (
            <img
              key={i}
              src={`http://localhost:3000${url}`}
              alt={`Photo ${i + 1}`}
              className={`photo photo-${i}`}
            />
          );
        })}
      </div>

      <div className="rent">
        {props.rent !== undefined ? (
          <h3>£{props.rent} pcm</h3>
        ) : (
          <h3>£{props.budget_min} - £{props.budget_max} pcm</h3>
        )}
      </div>

      {(isMobile && showMore || !isMobile) && (
        <>
          <div className="furtherInfo">
            <ul className="listingUl">
              <li className="listing">
                <strong>Move in date:</strong> {formatDate(props.move_in_date_min)} - {formatDate(props.move_in_date_max)}
              </li>
              <li className="listing">
                <strong>Location:</strong> {props.location}
              </li>

              {props.rent !== undefined ? (
                <li className="listing">
                  <strong>Age of current flatmates:</strong> {formatAgeRange(props.age_range_min, props.age_range_max)}
                </li>
              ) : (
                <li className="listing">
                  <strong>Preferred age range:</strong> {formatAgeRange(props.age_range_min, props.age_range_max)}
                </li>
              )}

              <li className="listing">
                <strong>Women only household:</strong> {props.women_only_household === 1 ? 'Yes' : 'No'}
              </li>
              <li className="listing">
                <strong>LGBTQ+ only household:</strong> {props.lgbtq_only_household === 1 ? 'Yes' : 'No'}
              </li>
            </ul>
          </div>

          <div className="longDescription">
            <p>{props.description}</p>
          </div>
        </>
      )}

      {isMobile && (
        <button 
          onClick={() => setShowMore(!showMore)}
          className="showMoreButton"
        >
          {showMore ? 'Show Less' : 'Show More'}
        </button>
      )}

      {isModalOpen && (
        <div className="modalOverlay">
          <div className="carouselModalContainer">
            <button 
              onClick={closeModal}
              className="closeModalButton"
            >
              &times;
            </button>

            <Slider initialSlide={currentIndex} dots={true} infinite={true} arrows={true}>
              {(props.photos || []).map((url, i) => (
                <div key={i} className="carouselSlide">
                  <img
                    src={`http://localhost:3000${url}`}
                    alt={`Photo ${i + 1}`}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomListingCard;
