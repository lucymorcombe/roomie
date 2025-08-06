import React from 'react';

function Step3RoomOrRoomie({ onNext, onPrevious, defaultValues }) {
  const handleSelect = (selection) => {
    onNext({ listingType: selection });
  };

  return (
    <div>
      <h2>Step 3: Choose your listing type</h2>
      <p>Please select one of the following options:</p>

      <div onClick={() => handleSelect('needsRoom')}>
        <strong>A room</strong>
        <p>I’m looking for a room in an existing house share</p>
      </div>

      <div onClick={() => handleSelect('hasRoom')}>
        <strong>A roomie</strong>
        <p>I’m looking for someone to fill an empty room in my home</p>
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
