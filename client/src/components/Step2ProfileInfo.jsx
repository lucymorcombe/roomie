import { useForm } from 'react-hook-form';

function Step2ProfileInfo({ onNext, onPrevious, defaultValues }) {
  const { register, handleSubmit } = useForm({ defaultValues });

  const onSubmit = (data) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Your public profile</h2>
      <p>
        This is the information that will be highlighted on your profile and ads. We need to know whether
        you smoke, vape, or have any pets, but other than that it is your choice what you’d like to share.
      </p>

      {/* Work status */}
      <div>
        <label>
          What do you do for work?
          <input type="text" {...register('workStatus')} />
        </label>
        <label>
          Hide from profile
          <input type="checkbox" {...register('hideWorkStatus')} />
        </label>
      </div>

      {/* Student status */}
      <div>
        <label>Are you a student?</label>
        <label><input type="radio" value="yes" {...register('student')} /> Yes</label>
        <label><input type="radio" value="no" {...register('student')} /> No</label>
        <label>
          Hide from profile
          <input type="checkbox" {...register('hideStudent')} />
        </label>
      </div>

      {/* Pets */}
      <div>
        <label>Do you have any pets?*</label>
        <label><input type="radio" value="yes" {...register('pets')} /> Yes</label>
        <label><input type="radio" value="no" {...register('pets')} /> No</label>
      </div>

      {/* Smoking/Vaping */}
      <div>
        <label>Do you smoke or vape?* (check all that apply)</label>
        <label><input type="checkbox" value="smoke" {...register('smoking')} /> I smoke</label>
        <label><input type="checkbox" value="vape" {...register('smoking')} /> I vape</label>
        <label><input type="checkbox" value="neither" {...register('smoking')} /> Neither</label>
      </div>

      {/* Pronouns */}
      <div>
        <label>
          What are your pronouns?
          <select {...register('pronouns')}>
            <option value="">Select...</option>
            <option value="she/her">she/her</option>
            <option value="he/him">he/him</option>
            <option value="they/them">they/them</option>
          </select>
        </label>
        <label>
          Hide from profile
          <input type="checkbox" {...register('hidePronouns')} />
        </label>
      </div>

      {/* LGBTQ+ identity */}
      <div>
        <label>Do you identify as LGBTQ+?</label>
        <label><input type="radio" value="yes" {...register('lgbtq')} /> Yes</label>
        <label><input type="radio" value="no" {...register('lgbtq')} /> No</label>
        <label><input type="radio" value="prefer-not-to-say" {...register('lgbtq')} /> Prefer not to say</label>
        <label>
          Hide from profile
          <input type="checkbox" {...register('hideLgbtq')} />
        </label>
      </div>

      {/* LGBTQ+ housing preference – always shown */}
      <div>
        <label>Are you seeking an LGBTQ+ home/housemate?</label>
        <label><input type="radio" value="yes" {...register('lgbtqPreference')} /> Yes</label>
        <label><input type="radio" value="no" {...register('lgbtqPreference')} /> No</label>
        <label>
          Hide from profile
          <input type="checkbox" {...register('hideLgbtqPreference')} />
        </label>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button type="button" onClick={onPrevious} style={{ marginRight: '1rem' }}>
          Previous
        </button>
        <button type="submit">Next</button>
      </div>
    </form>
  );
}

export default Step2ProfileInfo;
