import { useForm } from 'react-hook-form';

function Step4CreateListing({ listingType, onNext, onPrevious, defaultValues, userId }) {
  const { register, handleSubmit } = useForm({ defaultValues });

  const onSubmitStep4 = (data) => {
    const step4Data = {
      listingType: listingType, // Include listing type from props
      rent: data.rent,
      budget_min: data.budget_min,
      budget_max: data.budget_max,
      available_date: data.available_date,
      move_in_min: data.move_in_min,
      move_in_max: data.move_in_max,
      tenancy_length: data.tenancy_length,
      stay_length: data.stay_length,
      location: data.location,
      preferred_location: data.preferred_location,
      flatmates_current: data.flatmates_current,
      flatmates_min: data.flatmates_min,
      flatmates_max: data.flatmates_max,
      flatmates_age_min: data.flatmates_age_min,
      flatmates_age_max: data.flatmates_age_max,
      flatmates_age_min_preferred: data.flatmates_age_min_preferred,
      flatmates_age_max_preferred: data.flatmates_age_max_preferred,
      womenOnlyHomeYN: data.womenOnlyHomeYN,
      lgbtqOnlyHomeYN: data.lgbtqOnlyHomeYN,
      seekingWomenOnlyHomeYN: data.seekingWomenOnlyHomeYN,
      seekingLgbtqOnlyHomeYN: data.seekingLgbtqOnlyHomeYN,
      description: data.description,
      photos: data.photos 
    };
    onNext(step4Data);
  };

  return (
    <div className='step4'>
      <form onSubmit={handleSubmit(onSubmitStep4)}>

        {/* Upload photos */}
        <div>
          <label>Upload photos (3-10)</label>
          <input type="file" accept="image/*" multiple {...register('photos')} />
        </div>

        {/* Rent or Budget */}
        <div>
          {listingType === 'hasRoom' ? (
            <>
              <label>How much is the rent?</label>
              <input type="number" {...register('rent')} />
            </>
          ) : (
            <>
              <label>What is your budget?</label>
              <div className="rangeGroup">
                <input type="number" placeholder="Minimum (£)" {...register('budget_min')} />
                <input type="number" placeholder="Maximum (£)" {...register('budget_max')} />
              </div>
            </>
          )}
        </div>

        {/* Available / Move-in Date */}
        <div>
          {listingType === 'hasRoom' ? (
            <>
              <label>When is the room available?</label>
              <input type="date" {...register('available_date')} />
            </>
          ) : (
            <>
              <label>When do you need to move?</label>
              <div className="rangeGroup">
                <input type="date" placeholder="Earliest" {...register('move_in_min')} />
                <input type="date" placeholder="Latest" {...register('move_in_max')} />
              </div>
            </>
          )}
        </div>

        {/* Tenancy length / Stay length */}
        <div>
          {listingType === 'hasRoom' ? (
            <>
              <label>How long is the tenancy?</label>
              <input type="text" {...register('tenancy_length')} />
            </>
          ) : (
            <>
              <label>How long do you want to stay?</label>
              <input type="number" placeholder="Months" {...register('stay_length')} />
            </>
          )}
        </div>

        {/* Location */}
        <div>
          {listingType === 'hasRoom' ? (
            <>
              <label>What's the location?</label>
              <input type="text" {...register('location')} />
            </>
          ) : (
            <>
              <label>Where do you want to live?</label>
              <input type="text" {...register('preferred_location')} />
            </>
          )}
        </div>

        {/* Flatmates number */}
        <div>
          {listingType === 'hasRoom' ? (
            <>
              <label>How many current flatmates are there?</label>
              <input type="number" {...register('flatmates_current')} />
            </>
          ) : (
            <>
              <label>How many flatmates do you want?</label>
              <div className="rangeGroup">
                <input type="number" placeholder="Minimum" {...register('flatmates_min')} />
                <input type="number" placeholder="Maximum" {...register('flatmates_max')} />
              </div>
            </>
          )}
        </div>

        {/* Age range of flatmates */}
        <div>
          {listingType === 'hasRoom' ? (
            <>
              <label>What is the age range of the current flatmates?</label>
              <div className="rangeGroup">
                <input type="number" placeholder="Youngest" {...register('flatmates_age_min')} />
                <input type="number" placeholder="Oldest" {...register('flatmates_age_max')} />
              </div>
            </>
          ) : (
            <>
              <label>What age range are you looking for?</label>
              <div className="rangeGroup">
                <input type="number" placeholder="Youngest" {...register('flatmates_age_min_preferred')} />
                <input type="number" placeholder="Oldest" {...register('flatmates_age_max_preferred')} />
              </div>
            </>
          )}
        </div>

        

        {/* Description */}
        <div>
          {listingType === 'hasRoom' ? (
            <>
              <label>Tell us more about you, your current flatmates, and the room:</label>
              <textarea {...register('description')} />
            </>
          ) : (
            <>
              <label>Tell us more about you and what you’re looking for:</label>
              <textarea {...register('description')} />
            </>
          )}
        </div>

        <div>
          {listingType === 'hasRoom' ? (
            <>
              <div className="inlineRadios">
                <label>Is your home a women-only home?</label>
                <label className='horizontal'><input type="radio" value="yes" {...register('womenOnlyHomeYN')} /> Yes</label>
                <label className='horizontal'><input type="radio" value="no" {...register('womenOnlyHomeYN')} /> No</label>
              </div>
              <div className="inlineRadios">
                <label>Is your home a lgbtq+ only home?</label>
                <label className='horizontal'><input type="radio" value="yes" {...register('lgbtqOnlyHomeYN')} /> Yes</label>
                <label className='horizontal'><input type="radio" value="no" {...register('lgbtqOnlyHomeYN')} /> No</label>
              </div>
            </>
          ) : (
            <>
              <div className="inlineRadios">
                <label>Are you looking for a women-only home?</label>
                <label className='horizontal'><input type="radio" value="yes" {...register('seekingWomenOnlyHomeYN')} /> Yes</label>
                <label className='horizontal'><input type="radio" value="no" {...register('seekingWomenOnlyHomeYN')} /> No</label>
              </div>
              <div className="inlineRadios">
                <label>Are you looking for a lgbtq+ only home?</label>
                <label className='horizontal'><input type="radio" value="yes" {...register('seekingLgbtqOnlyHomeYN')} /> Yes</label>
                <label className='horizontal'><input type="radio" value="no" {...register('seekingLgbtqOnlyHomeYN')} /> No</label>
              </div>
            </>
          )}
            </div>

        {/* Navigation Buttons */}
        <div style={{ marginTop: '1rem' }}>
          <button type="button" onClick={onPrevious} style={{ marginRight: '1rem' }}>
            Previous
          </button>
          <button type="submit">Next</button>
        </div>
      </form>
    </div>
  );
}

export default Step4CreateListing;
