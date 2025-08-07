import { useForm } from 'react-hook-form';

function Step2ProfileInfo({ onNext, onPrevious, defaultValues }) {
  const { register, handleSubmit } = useForm({ defaultValues });

  const onSubmit = (data) => {
    onNext(data);
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
        
        <form onSubmit={handleSubmit(onSubmit)}>
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
        <div className='horizontalField leftColumn'>
          <label className='horizontal'>Do you have any pets?</label>
          <label className='horizontal'><input type="radio" value="yes" {...register('pets', { required: true })} /> Yes</label>
          <label className='horizontal'><input type="radio" value="no" {...register('pets', { required: true })} /> No</label>
        </div>

        {/* Smoking/Vaping */}
        <div className='horizontalField leftColumn'>
            <label>Do you smoke or vape?</label>
            <label className='horizontal'>
                <input type="checkbox" value="smoke" {...register('smokingOptions', { required: true })} /> I smoke
            </label>
            <label className='horizontal'>
                <input type="checkbox" value="vape" {...register('smokingOptions', { required: true })} /> I vape
            </label>
            <label className='horizontal'>
                <input type="checkbox" value="neither" {...register('smokingOptions', { required: true })} /> Neither
            </label>

        </div>

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
