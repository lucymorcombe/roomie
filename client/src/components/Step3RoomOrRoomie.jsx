import React from 'react';
import homeIcon from "../assets/homeIcon.jpg";
import roomIcon from "../assets/roomIcon.jpg";

function Step3RoomOrRoomie({ onNext, onPrevious, defaultValues }) {
  const handleSelect = (selection) => {
    onNext({ listingType: selection });
  };

  return (
    <div>
      <div className='optionBoxContainer'>
        <div className="optionBox" onClick={() => handleSelect('needsRoom')}>
          <h3>A Room</h3>
          <img className="homeIcon" src={homeIcon}/>
          <p>I’m looking for a room in an existing house share.</p>
        </div>

        <div className="optionBox" onClick={() => handleSelect('hasRoom')}>
          <h3>A Roomie</h3>
          <img className="roomIcon" src={homeIcon}/>
          <p>I’m looking for someone to fill an empty room in my home</p>
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button type="button" onClick={onPrevious}>
          Previous
        </button>
      </div>
    </div>
  );
}

export default Step3RoomOrRoomie;
