import { useForm } from 'react-hook-form';

function Step4CreateListing({ listingType, onNext, onPrevious, defaultValues }) {
  const { register, handleSubmit } = useForm({ defaultValues });

  const onSubmit = (data) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Create your ad</h2>

      {/* Upload photos: same for both */}
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
            <label>What is your budget? </label>
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
            <label>How long do you want to stay? </label>
            <input type="text" placeholder="Minimum" {...register('stay_length_min')} />
            <input type="text" placeholder="Maximum" {...register('stay_length_max')} />
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
