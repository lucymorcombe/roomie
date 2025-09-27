import { useState } from 'react';
import { useForm } from 'react-hook-form';

function Step1ProfileInfo({ onNext, defaultValues }) {
  console.log("Step1 defaultValues:", defaultValues);

  const { register, handleSubmit, watch } = useForm({ defaultValues });
  const [profilePreview, setProfilePreview] = useState(defaultValues?.profilePictureUrl || null);
  const [uploading, setUploading] = useState(false);

  // Watch for file input changes
  const profilePictureFile = watch('profilePicture');

  // Handle profile picture preview
  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setProfilePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const onSubmitStep1 = async (data) => {
    setUploading(true);
    
    try {
      let profilePictureUrl = defaultValues?.profilePictureUrl || null;

      // Upload profile picture if a new one was selected
      if (data.profilePicture?.[0]) {
        const formData = new FormData();
        formData.append('image', data.profilePicture[0]);

        const response = await fetch('/api/upload-image', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || 'Upload failed');
        }

        profilePictureUrl = result.imageUrl;
      }

      const step1Data = {
        bio: data.bio,
        profilePictureUrl: profilePictureUrl
      };

      onNext(step1Data);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitStep1)}>
      <label>
        Profile Picture:
        <input 
          type="file" 
          accept="image/*"
          {...register('profilePicture')} 
          onChange={handleProfilePictureChange}
        />
        {profilePreview && (
          <div style={{ marginTop: '10px' }}>
            <img 
              src={profilePreview} 
              alt="Profile preview" 
              style={{ 
                width: '150px', 
                height: '150px', 
                objectFit: 'cover', 
                borderRadius: '50%' 
              }} 
            />
          </div>
        )}
      </label>

      <label>
        About You:
        <p>Just a little about yourself. Don't worry, there will be more opportunities to share what you're looking for in the next steps.</p>
        <textarea {...register('bio')} />
      </label>

      <button type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Next'}
      </button>
    </form>
  );
}

export default Step1ProfileInfo;