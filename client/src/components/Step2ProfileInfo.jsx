import { useForm } from 'react-hook-form';
import { useState } from 'react';

function Step2ProfileInfo({ onNext, onPrevious, defaultValues }) {
  console.log("Step2 defaultValues:", defaultValues);

  const { register, handleSubmit, watch } = useForm({ defaultValues });
  // const [smokingOptions, setSmokingOptions] = useState(defaultValues.smokingOptions || []);

  // const handleCheckboxChange = (e) => {
  //   const { value, checked } = e.target;
  //   setSmokingOptions((prev) => {
  //     if (checked) return [...prev, value];
  //     return prev.filter((v) => v !== value);
  //   });
  // };

  const onSubmitStep2 = (data) => {
    const step2Data = {
      workStatus: data.workStatus,
      student: data.student,
      pets: data.pets,
      pronouns: data.pronouns,
      lgbtq: data.lgbtq,
      genderIdentity: data.genderIdentity,
      genderPreference: data.genderPreference,
      lgbtqPreference: data.lgbtqPreference,
      smokes: data.smokes,
      hideWorkStatus: data.hideWorkStatus,
      hideStudent: data.hideStudent,
      hidePets: data.hidePets,
      hidePronouns: data.hidePronouns,
      hideLgbtq: data.hideLgbtq,
      hideGenderIdentity: data.hideGenderIdentity,
      hideGenderPreference: data.hideGenderPreference,
      hideLgbtqPreference: data.hideLgbtqPreference
    };

    onNext(step2Data);

  };
  
  return (
    <div className='stepTwo'>
      <p className='stepIntro'>
        This is the information that will be highlighted on your profile and ads. We need to know whether
        you smoke, vape, or have any pets, but other than that it is your choice what you’d like to share.
      </p>

      <div className='hideNotice'>
        <p>Hide from<br/>profile</p>
      </div>

      <form onSubmit={handleSubmit(onSubmitStep2)}>
        {/* Work status */}
        <div className='horizontalField'>
          <div className="leftColumn">
            <label className='horizontal textInput'>
              What do you do for work?
              <input type="text" {...register('workStatus')} />
            </label>
          </div>
          <div className='rightColumn'>
            <label className='hideOption'>
              <input type="checkbox" {...register('hideWorkStatus')} />
            </label>
          </div>
        </div>

        {/* Student status */}
        <div className='horizontalField'>
          <div className='leftColumn'>
            <label>Are you a student?</label>
            <label className='horizontal'><input type="radio" value="yes" {...register('student')} /> Yes</label>
            <label className='horizontal'><input type="radio" value="no" {...register('student')} /> No</label>
          </div>
          <div className='rightColumn'>
            <label className='hideOption'>
              <input type="checkbox" {...register('hideStudent')} />
            </label>
          </div>
        </div>

        {/* Pets */}
        <div className='horizontalField noHide'>
          <div className='leftColumn'>
            <label className='horizontal'>Do you have any pets?<span className='required'>*</span></label>
            <label className='horizontal'><input type="radio" value="yes" {...register('pets', { required: true })} /> Yes</label>
            <label className='horizontal'><input type="radio" value="no" {...register('pets', { required: true })} /> No</label>
          </div>
        </div>

        <div className='horizontalField noHide'>
          <div className='leftColumn'>
            <label className='horizontal'>Do you smoke or vape?<span className='required'>*</span></label>
            <label className='horizontal'><input type="radio" value="yes" {...register('smokes', { required: true })} /> Yes</label>
            <label className='horizontal'><input type="radio" value="no" {...register('smokes', { required: true })} /> No</label>
          </div>
        </div>

        {/* Smoking/Vaping
        <div className='horizontalField leftColumn'>
          <label>Do you smoke or vape?</label>
          <label className='horizontal'>
            <input type="checkbox" value="yes" checked={smokingOptions.includes('yes')} onChange={handleCheckboxChange} /> I smoke
          </label>
          <label className='horizontal'>
            <input type="checkbox" value="no" checked={smokingOptions.includes('no')} onChange={handleCheckboxChange} /> I vape
          </label>
          {/* <label className='horizontal'>
            <input type="checkbox" value="neither" checked={smokingOptions.includes('neither')} onChange={handleCheckboxChange} /> Neither
          </label> 
        </div>}
         */}

        {/* Pronouns */}
        <div className='horizontalField'>
          <div className='leftColumn'>
            <label className='horizontal textInput'>
              What are your pronouns?
              <select {...register('pronouns')}>
                <option value="">Select...</option>
                <option value="she/her">she/her</option>
                <option value="he/him">he/him</option>
                <option value="they/them">they/them</option>
              </select>
            </label>
          </div>
          <div className='rightColumn'>
            <label className='hideOption'>
              <input type="checkbox" {...register('hidePronouns')} />
            </label>
          </div>
        </div>

        {/* LGBTQ+ identity */}
        <div className='horizontalField'>
          <div className='leftColumn'>
            <label>Do you identify as LGBTQ+?</label>
            <label className='horizontal'><input type="radio" value="yes" {...register('lgbtq')} /> Yes</label>
            <label className='horizontal'><input type="radio" value="no" {...register('lgbtq')} /> No</label>
          </div>
          <div className='rightColumn'>
            <label className='hideOption'>
              <input type="checkbox" {...register('hideLgbtq')} />
            </label>
          </div>
        </div>

        {/* LGBTQ+ housing preference – always shown */}
        <div className='horizontalField'>
          <div className='leftColumn'>
            <label>Are you seeking an LGBTQ+ home/housemate?</label>
            <label className='horizontal'><input type="radio" value="yes" {...register('lgbtqPreference')} /> Yes</label>
            <label className='horizontal'><input type="radio" value="no" {...register('lgbtqPreference')} /> No</label>
          </div>
          <div className='rightColumn'>
            <label className='hideOption'>
              <input type="checkbox" {...register('hideLgbtqPreference')} />
            </label>
          </div>
        </div>

        {/* Gender identity */}
        {/* <div className='horizontalField'>
          <div className='leftColumn'>
            <label>What is your gender identity?</label>
            <label className='horizontal'><input type="radio" value="Woman" {...register('genderIdentity')} /> Woman</label>
            <label className='horizontal'><input type="radio" value="Man" {...register('genderIdentity')} /> Man</label>
            <label className='horizontal'><input type="radio" value="Trans woman" {...register('genderIdentity')} /> Trans woman</label>
            <label className='horizontal'><input type="radio" value="Trans man" {...register('genderIdentity')} /> Trans man</label>
            <label className='horizontal'><input type="radio" value="Non-binary" {...register('genderIdentity')} /> Non-binary</label>
            <label className='horizontal'><input type="radio" value="Other" {...register('genderIdentity')} /> Other</label>
          </div>
          <div className='rightColumn'>
            <label className='hideOption'>
              <input type="checkbox" {...register('hideGenderIdentity')} />
            </label>
          </div>
        </div> */}

        <div className='horizontalField'>
          <div className='leftColumn'>
            <label className='horizontal textInput'>
              What is your gender identity?
              <select {...register('genderIdentity')}>
                <option value="">Select...</option>
                <option value="Woman">Woman</option>
                <option value="Man">Man</option>
                <option value="Trans woman">Trans woman</option>
                <option value="Trans man">Trans man</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </label>
          </div>
          <div className='rightColumn'>
            <label className='hideOption'>
              <input type="checkbox" {...register('hideGenderIdentity')} />
            </label>
          </div>
        </div>

        {/* Gender preference */}
        <div className='horizontalField'>
          <div className='leftColumn'>
            <label>Are you seeking a women-only home/housemate?</label>
            <label className='horizontal'><input type="radio" value="yes" {...register('genderPreference')} /> Yes</label>
            <label className='horizontal'><input type="radio" value="no" {...register('genderPreference')} /> No</label>
          </div>
          <div className='rightColumn'>
            <label className='hideOption'>
              <input type="checkbox" {...register('hideGenderPreference')} />
            </label>
          </div>
        </div>

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

export default Step2ProfileInfo;
