import React, { useState } from 'react';
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
  console.log("Photos received:", props.photos);
  console.log("Photos array for listing:", props.photos);
  console.log("RoomListingCard props.photos:", props.photos);

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
        {(props.photos || []).map((url, i) => (
          <img
            key={i}
            src={`http://localhost:3000/images/${url}`}
            alt={`Photo ${i + 1}`}
            className={`photo photo-${i}`}
            style={i === 2 ? { cursor: 'pointer' } : {}}
            onClick={i === 2 ? () => openModal(i) : undefined}
          />
        ))}
      </div>

      <div className="rent">
        {props.rent !== undefined ? (
          <h3>£{props.rent} pcm</h3>
        ) : (
          <h3>£{props.budget_min} - £{props.budget_max} pcm</h3>
        )}
      </div>

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
                    src={`http://localhost:3000/images/${url}`}
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
