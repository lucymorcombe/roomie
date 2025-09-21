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
      description: data.description,
      photos: data.photos 
    };
    onNext(step4Data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitStep4)}>
      <h2>Create your ad</h2>

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
            <input type="number" placeholder="Minimum (£)" {...register('budget_min')} />
            <input type="number" placeholder="Maximum (£)" {...register('budget_max')} />
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
            <input type="date" placeholder="Earliest" {...register('move_in_min')} />
            <input type="date" placeholder="Latest" {...register('move_in_max')} />
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
            <input type="number" placeholder="Minimum" {...register('flatmates_min')} />
            <input type="number" placeholder="Maximum" {...register('flatmates_max')} />
          </>
        )}
      </div>

      {/* Age range of flatmates */}
      <div>
        {listingType === 'hasRoom' ? (
          <>
            <label>What is the age range of the current flatmates?</label>
            <input type="number" placeholder="Youngest" {...register('flatmates_age_min')} />
            <input type="number" placeholder="Oldest" {...register('flatmates_age_max')} />
          </>
        ) : (
          <>
            <label>What age range are you looking for?</label>
            <input type="number" placeholder="Youngest" {...register('flatmates_age_min_preferred')} />
            <input type="number" placeholder="Oldest" {...register('flatmates_age_max_preferred')} />
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
            <label>Is your home a women-only home?</label>
            <label className='horizontal'><input type="radio" value="yes" {...register('womenOnlyHomeYN')} /> Yes</label>
            <label className='horizontal'><input type="radio" value="no" {...register('womenOnlyHomeYN')} /> No</label>
            <label>Is your home a lgbtq+ only home?</label>
            <label className='horizontal'><input type="radio" value="yes" {...register('lgbtqOnlyHomeYN')} /> Yes</label>
            <label className='horizontal'><input type="radio" value="no" {...register('lgbtqOnlyHomeYN')} /> No</label>
          </>
        ) : 
        (
          <></>
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
  );
}

export default Step4CreateListing;
