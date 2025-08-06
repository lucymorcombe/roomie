import { useForm, Controller } from 'react-hook-form';

function Step5Questionnaire({ onNext }) {
  const defaultValues = {
    q1: [],
    q2: 5,
    q3: '',
    q4: 5,
    q5: '',
    q6: '',
    q7: [5, 5, 5, 5, 5, 5, 5],
    q8: '',
    q9: '',
    q10: [],
    q11: {
      Cleanliness: '',
      Sociability: '',
      'Routine compatibility': '',
      'Respect for boundaries': '',
      'Shared values or identity': '',
      'Similar lifestyles or habits': '',
      'Quiet/calm atmosphere': '',
      'Feeling safe and respected': '',
      'Having fun and being friends': '',
    },
    q12: [],
    q13: {
      Smokes: '',
      Vapes: '',
      'Has pets': '',
    },
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });

  const onSubmit = (data) => {
    onNext(data);
  };

  const q7Labels = [
    'Loud music late at night',
    'Dirty dishes left out',
    'Mess in shared areas',
    'Borrowing your stuff without asking',
    'Hosting guests too often',
    'Passive-aggressive texts about chores',
    'Never pulling their weight around the house',
  ];

  const q11Labels = Object.keys(defaultValues.q11);
  const q13Labels = Object.keys(defaultValues.q13);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Step 5: Questionnaire</h2>

      <fieldset>
        <legend>1. How do you usually spend your evenings at home? (Pick up to 3)</legend>
        {[
          'Hanging out with housemates',
          'Watching TV or gaming alone',
          'Going out or being social',
          'Hosting friends',
          'Studying or working late',
          'Going to bed early',
          'Something else',
        ].map((option) => (
          <label key={option}>
            <input type="checkbox" value={option} {...register('q1', { required: true })} />
            {option}
          </label>
        ))}
      </fieldset>

      <label>
        2. How sociable do you want your next flatmate to be?
        <Controller
          name="q2"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <input type="range" min={0} max={10} step={1} {...field} />
          )}
        />
      </label>

      <fieldset>
        <legend>3. How often would you ideally do things with your flatmates?</legend>
        {[
          'All the time – I want to be friends',
          'A few times a week',
          'Only at weekends – I’m too busy in the week',
          'Occasionally – e.g. a shared meal or pub night',
          'Rarely – just polite small talk',
          'Never – I prefer to live totally independently',
        ].map((option) => (
          <label key={option}>
            <input type="radio" value={option} {...register('q3', { required: true })} />
            {option}
          </label>
        ))}
      </fieldset>

      <label>
        4. What’s your ideal level of cleanliness in shared spaces?
        <Controller
          name="q4"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <input type="range" min={0} max={10} step={1} {...field} />
          )}
        />
      </label>

      <fieldset>
        <legend>5. What’s your approach to chores?</legend>
        {[
          'I like a clear rota or system',
          'I just clean up after myself',
          'I don’t mind doing a bit extra if it needs it',
          'I don’t want to share cleaning responsibilities',
        ].map((option) => (
          <label key={option}>
            <input type="radio" value={option} {...register('q5', { required: true })} />
            {option}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>6. How long do you think it’s okay to leave dirty dishes in the sink?</legend>
        {[
          'They should be done immediately',
          'Same day is fine',
          '1–2 days is okay',
          'Doesn’t bother me',
        ].map((option) => (
          <label key={option}>
            <input type="radio" value={option} {...register('q6', { required: true })} />
            {option}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>7. How annoying would you find the following in a flatmate?</legend>
        {q7Labels.map((label, index) => (
          <label key={label}>
            {label}
            <Controller
              name={`q7.${index}`}
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input type="range" min={0} max={10} step={1} {...field} />
              )}
            />
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>8. What best describes your work/study routine?</legend>
        {[
          '9–5 from an office',
          '9–5 hybrid or from home',
          'Evening/night shifts',
          'Variable hours or freelance',
          'Full-time student',
          'Unemployed/other',
        ].map((option) => (
          <label key={option}>
            <input type="radio" value={option} {...register('q8', { required: true })} />
            {option}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>9. How comfortable are you with drugs being used in your home?</legend>
        {[
          'Totally fine with it',
          'Okay occasionally but not often',
          'Only if it\'s discreet',
          'I’d strongly prefer a drug-free home',
          'Dealbreaker – absolutely not',
        ].map((option) => (
          <label key={option}>
            <input type="radio" value={option} {...register('q9', { required: true })} />
            {option}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>10. Which of these best describe you as a flatmate? (Pick up to 2)</legend>
        {[
          'The Clean Queen 👑',
          'The Social Butterfly 🦋',
          'The Quiet One 🤫',
          'The Organised One 📅',
          'The Laid-Back Legend 😎',
          'The “Out All The Time” Type 🏃',
          'The Cozy Homebody 🧸',
          'The “Headphones Always In” Flatmate 🎧',
          'Something else',
        ].map((option) => (
          <label key={option}>
            <input type="checkbox" value={option} {...register('q10', { required: true })} />
            {option}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>11. Rank the following in order of importance to you in a flatmate/home (1–9)</legend>
        {q11Labels.map((label) => (
          <label key={label}>
            {label}
            <input
              type="number"
              min="1"
              max="9"
              {...register(`q11.${label}`, { required: true })}
            />
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>12. What’s something that would instantly make you not want to live with someone? (Pick up to 2)</legend>
        {[
          'Disrespecting boundaries',
          'Never cleaning',
          'Being too quiet',
          'Being too loud',
          'Not communicating',
          'Always having guests over',
          'Smoking indoors',
          'Using drugs at home',
          'Being passive-aggressive',
          'Nothing really bothers me',
        ].map((option) => (
          <label key={option}>
            <input type="checkbox" value={option} {...register('q12', { required: true })} />
            {option}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>13. Is it a dealbreaker if the person/people you live with…</legend>
        {q13Labels.map((label) => (
          <div key={label}>
            <span>{label}</span>
            <label>
              <input type="radio" value="yes" {...register(`q13.${label}`, { required: true })} />
              Yes
            </label>
            <label>
              <input type="radio" value="no" {...register(`q13.${label}`, { required: true })} />
              No
            </label>
          </div>
        ))}
      </fieldset>

      <button type="submit">Next</button>
    </form>
  );
}

export default Step5Questionnaire;
