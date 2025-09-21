import { useForm } from 'react-hook-form';

function Step1ProfileInfo({ onNext, defaultValues }) {
  console.log("Step1 defaultValues:", defaultValues);

  const { register, handleSubmit } = useForm({ defaultValues });

  const onSubmitStep1 = (data) => {
    const step1Data = {
      bio: data.bio,
      profilePicture: data.profilePicture?.[0] || null,
      profilePictureUrl: null
    };

    onNext(step1Data); //send data to wizard
  };

  return (
    <form onSubmit={handleSubmit(onSubmitStep1)}>
      <label>
        Profile Picture:
        <input type="file" {...register('profilePicture')} />
      </label>

      <label>
        About You:
        <p>Just a little about yourself. Don’t worry, there will be more opportunities to share what you’re looking for in the next steps.</p>
        <textarea {...register('bio')} />
      </label>

      <button type="submit">Next</button>
    </form>
  );
}

export default Step1ProfileInfo;
