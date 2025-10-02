import { useState } from 'react';
import { useForm } from 'react-hook-form';

function Step4CreateListing({ listingType, onNext, onPrevious, defaultValues, userId }) {
  const { register, handleSubmit, watch } = useForm({ defaultValues });
  const [photoPreviews, setPhotoPreviews] = useState(defaultValues?.photos || []);
  const [uploading, setUploading] = useState(false);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    
    const previews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target.result);
        if (previews.length === files.length) {
          setPhotoPreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (indexToRemove) => {
    setPhotoPreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const onSubmitStep4 = async (data) => {
    setUploading(true);
    
    try {
      let photoUrls = defaultValues?.photos || [];

      if (data.photos?.length > 0) {
        const formData = new FormData();
        Array.from(data.photos).forEach(file => {
          formData.append('images', file);
        });

        const response = await fetch('/api/upload-images', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || 'Upload failed');
        }

        photoUrls = result.imageUrls;
      }

      const step4Data = {
        listingType: listingType,
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
        petsAccepted: data.petsAccepted,
        openToPets: data.openToPets,
        womenOnlyHomeYN: data.womenOnlyHomeYN,
        lgbtqOnlyHomeYN: data.lgbtqOnlyHomeYN,
        seekingWomenOnlyHomeYN: data.seekingWomenOnlyHomeYN,
        seekingLgbtqOnlyHomeYN: data.seekingLgbtqOnlyHomeYN,
        description: data.description,
        photos: photoUrls
      };
      
      onNext(step4Data);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='step4'>
      <form onSubmit={handleSubmit(onSubmitStep4)}>

        <div>
          <label className='step4Label'>Upload photos (3-10)<span className='required'>*</span></label>
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            {...register('photos')} 
            onChange={handlePhotoChange}
          />
          
          {photoPreviews.length > 0 && (
            <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {photoPreviews.map((preview, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      background: '#2ee895',
                      color: '#E82E81',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      fontSize: '16px',
                      fontWeight:'800',
                      paddingLeft:'0px',
                      paddingRight:'0px',
                      paddingTop:'0px',
                      paddingBottom:'23px'
                    }}
                  >
                    -
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {listingType === 'hasRoom' ? (
            <>
              <label className='step4Label'>How much is the rent?<span className='required'>*</span></label>
              <input type="number" {...register('rent')} />
            </>
          ) : (
            <>
              <label className='step4Label'>What is your budget?<span className='required'>*</span></label>
              <div className="rangeGroup">
                <input type="number" placeholder="Minimum (£)" {...register('budget_min')} />
                <input type="number" placeholder="Maximum (£)" {...register('budget_max')} />
              </div>
            </>
          )}
        </div>

        <div>
          {listingType === 'hasRoom' ? (
            <>
              <label className='step4Label'>When is the room available?<span className='required'>*</span></label>
              <input type="date" {...register('available_date')} />
            </>
          ) : (
            <>
              <label className='step4Label'>When do you need to move?<span className='required'>*</span></label>
              <div className="rangeGroup">
                <input type="date" placeholder="Earliest" {...register('move_in_min')} />
                <input type="date" placeholder="Latest" {...register('move_in_max')} />
              </div>
            </>
          )}
        </div>

        <div>
          {listingType === 'hasRoom' ? (
            <>
              <label className='step4Label'>How long is the tenancy?<span className='required'>*</span></label>
              <input type="text" {...register('tenancy_length')} />
            </>
          ) : (
            <>
              <label className='step4Label'>How long do you want to stay?<span className='required'>*</span></label>
              <input type="number" placeholder="Months" {...register('stay_length')} />
            </>
          )}
        </div>

        <div>
          {listingType === 'hasRoom' ? (
            <>
              <label className='step4Label'>What's the location?<span className='required'>*</span></label>
              <input type="text" {...register('location')} />
            </>
          ) : (
            <>
              <label className='step4Label'>Where do you want to live?<span className='required'>*</span></label>
              <input type="text" {...register('preferred_location')} />
            </>
          )}
        </div>

        <div>
          {listingType === 'hasRoom' ? (
            <>
              <label className='step4Label'>How many current flatmates are there?<span className='required'>*</span></label>
              <input type="number" {...register('flatmates_current')} />
            </>
          ) : (
            <>
              <label className='step4Label'>How many flatmates do you want?<span className='required'>*</span></label>
              <div className="rangeGroup">
                <input type="number" placeholder="Minimum" {...register('flatmates_min')} />
                <input type="number" placeholder="Maximum" {...register('flatmates_max')} />
              </div>
            </>
          )}
        </div>

        <div>
          {listingType === 'hasRoom' ? (
            <>
              <label className='step4Label'>What is the age range of the current flatmates?<span className='required'>*</span></label>
              <div className="rangeGroup">
                <input type="number" placeholder="Youngest" {...register('flatmates_age_min')} />
                <input type="number" placeholder="Oldest" {...register('flatmates_age_max')} />
              </div>
            </>
          ) : (
            <>
              <label className='step4Label'>What age range are you looking for?<span className='required'>*</span></label>
              <div className="rangeGroup">
                <input type="number" placeholder="Youngest" {...register('flatmates_age_min_preferred')} />
                <input type="number" placeholder="Oldest" {...register('flatmates_age_max_preferred')} />
              </div>
            </>
          )}
        </div>

        <div>
          {listingType === 'hasRoom' ? (
            <>
              <label className='step4Label'>Tell us more about you, your current flatmates, and the room:<span className='required'>*</span></label>
              <textarea {...register('description')} />
            </>
          ) : (
            <>
              <label className='step4Label'>Tell us more about you and what you're looking for:<span className='required'>*</span></label>
              <textarea {...register('description')} />
            </>
          )}
        </div>

        <div>
          {listingType === 'hasRoom' ? (
            <>
              <div className="inlineRadios">
                <label className='step4Label'>Does your home accept pets?</label>
                <label className='horizontal'><input type="radio" value="yes" {...register('petsAccepted')} /> Yes</label>
                <label className='horizontal'><input type="radio" value="no" {...register('petsAccepted')} /> No</label>
              </div>
              <div className="inlineRadios">
                <label className='step4Label'>Is your home a women-only home?</label>
                <label className='horizontal'><input type="radio" value="yes" {...register('womenOnlyHomeYN')} /> Yes</label>
                <label className='horizontal'><input type="radio" value="no" {...register('womenOnlyHomeYN')} /> No</label>
              </div>
              <div className="inlineRadios">
                <label className='step4Label'>Is your home a lgbtq+ only home?</label>
                <label className='horizontal'><input type="radio" value="yes" {...register('lgbtqOnlyHomeYN')} /> Yes</label>
                <label className='horizontal'><input type="radio" value="no" {...register('lgbtqOnlyHomeYN')} /> No</label>
              </div>
            </>
          ) : (
            <>
              <div className="inlineRadios">
                <label className='step4Label'>Are you happy to live with pets?</label>
                <label className='horizontal'><input type="radio" value="yes" {...register('openToPets')} /> Yes</label>
                <label className='horizontal'><input type="radio" value="no" {...register('openToPets')} /> No</label>
              </div>
              <div className="inlineRadios">
                <label className='step4Label'>Are you looking for a women-only home?</label>
                <label className='horizontal'><input type="radio" value="yes" {...register('seekingWomenOnlyHomeYN')} /> Yes</label>
                <label className='horizontal'><input type="radio" value="no" {...register('seekingWomenOnlyHomeYN')} /> No</label>
              </div>
              <div className="inlineRadios">
                <label className='step4Label'>Are you looking for a lgbtq+ only home?</label>
                <label className='horizontal'><input type="radio" value="yes" {...register('seekingLgbtqOnlyHomeYN')} /> Yes</label>
                <label className='horizontal'><input type="radio" value="no" {...register('seekingLgbtqOnlyHomeYN')} /> No</label>
              </div>
            </>
          )}
        </div>

        

        <div style={{ marginTop: '1rem' }}>
          <button type="button" onClick={onPrevious} style={{ marginRight: '1rem' }}>
            Previous
          </button>
          <button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Step4CreateListing;