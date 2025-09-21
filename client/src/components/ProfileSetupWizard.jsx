// import { useState } from "react";
// import Step1ProfileInfo from "./Step1ProfileInfo";
// import Step2ProfileInfo from "./Step2ProfileInfo";
// import Step3RoomOrRoomie from "./Step3RoomOrRoomie";
// import Step4CreateListing from "./Step4CreateListing";
// import Step5Questionnaire from "./Step5Questionnaire";
// import { useSession } from "./SessionContext.jsx";

// function ProfileSetupWizard() {
//   const { session } = useSession();
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({});
//   const [isComplete, setIsComplete] = useState(false);
//   const userId = session.userId;

//   // Helper to save individual step to backend
//   const saveStepToBackend = async (stepKey, data) => {
//     if (!userId) return;

//     try {
//       const response = await fetch('/api/profile-setup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ [stepKey]: data }),
//       });

//       const result = await response.json();
//       if (!result.success) throw new Error(result.error || 'Failed to save');

//       console.log(`${stepKey} saved!`, result);
//     } catch (err) {
//       console.error(`${stepKey} save error:`, err);
//     }
//   };

//   // Handles next step and sends data to backend
//   const handleStepData = async (newData, stepKey) => {
//     setFormData((prev) => ({ ...prev, ...newData }));

//     // save this step to the backend
//     await saveStepToBackend(stepKey, newData);

//     if (step < 5) {
//       setStep((prev) => prev + 1);
//     } else {
//       setIsComplete(true);
//     }
//   };

//   const handlePrevious = () => {
//     setStep((prev) => Math.max(prev - 1, 1));
//   };

//   if (isComplete) {
//     return (
//       <div className="profileSetupPage">
//         <h1>🎉 Profile complete!</h1>
//         <p>Your profile has been set up successfully.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="profileSetupPage">
//       {step === 1 && <h1>Personalise Your Profile...</h1>}
//       {step === 2 && <h1>Your Public Profile...</h1>}
//       {step === 3 && <h1>What are you looking for?</h1>}
//       {step === 4 && <h1>Create Your Listing...</h1>}
//       {step === 5 && <h1>Roomie's Lifestyle Questionnaire...</h1>}

//       <div className="profileSetupContainer">
//         <h4>Step {step} of 5</h4>

//         {step === 1 && (
//           <Step1ProfileInfo
//             onNext={(data) => handleStepData(data, 'step1')}
//             defaultValues={{
//               profilePicture: formData.profilePicture,
//               bio: formData.bio,
//             }}
//           />
//         )}

//         {step === 2 && (
//           <Step2ProfileInfo
//             onNext={(data) => handleStepData(data, 'step2')}
//             onPrevious={handlePrevious}
//             defaultValues={{
//               workStatus: formData.workStatus,
//               student: formData.student,
//               pets: formData.pets,
//               pronouns: formData.pronouns,
//               lgbtq: formData.lgbtq,
//               genderIdentity: formData.genderIdentity,
//               genderPreference: formData.genderPreference,
//               lgbtqPreference: formData.lgbtqPreference,
//               smokingOptions: formData.smokingOptions,
//               hideWorkStatus: formData.hideWorkStatus,
//               hideStudent: formData.hideStudent,
//               hidePets: formData.hidePets,
//               hidePronouns: formData.hidePronouns,
//               hideLgbtq: formData.hideLgbtq,
//               hideGenderIdentity: formData.hideGenderIdentity,
//               hideGenderPreference: formData.hideGenderPreference,
//               hideLgbtqPreference: formData.hideLgbtqPreference,
//             }}
//           />
//         )}

//         {step === 3 && (
//           <Step3RoomOrRoomie
//             onNext={(data) => handleStepData(data, 'step3')}
//             onPrevious={handlePrevious}
//             defaultValues={{
//               listingType: formData.listingType,
//             }}
//           />
//         )}

//         {step === 4 && (
//           <Step4CreateListing
//             onNext={(data) => handleStepData(data, 'step4')}
//             onPrevious={handlePrevious}
//             listingType={formData.listingType}
//             defaultValues={{
//               rent: formData.rent,
//               budget_min: formData.budget_min,
//               budget_max: formData.budget_max,
//               available_date: formData.available_date,
//               move_in_min: formData.move_in_min,
//               move_in_max: formData.move_in_max,
//               tenancy_length: formData.tenancy_length,
//               stay_length_min: formData.stay_length_min,
//               stay_length_max: formData.stay_length_max,
//               location: formData.location,
//               preferred_location: formData.preferred_location,
//               flatmates_current: formData.flatmates_current,
//               flatmates_min: formData.flatmates_min,
//               flatmates_max: formData.flatmates_max,
//               flatmates_age_min: formData.flatmates_age_min,
//               flatmates_age_max: formData.flatmates_age_max,
//               flatmates_age_min_preferred: formData.flatmates_age_min_preferred,
//               flatmates_age_max_preferred: formData.flatmates_age_max_preferred,
//               womenOnlyHomeYN: formData.womenOnlyHomeYN,
//               lgbtqOnlyHomeYN: formData.lgbtqOnlyHomeYN,
//               description: formData.description,
//               photos: formData.photos,
//             }}
//           />
//         )}

//         {step === 5 && (
//           <Step5Questionnaire
//             onNext={(data) => handleStepData(data, 'step5')}
//             onPrevious={handlePrevious}
//             defaultValues={formData}
//             formData={formData}
//             userId={userId}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// export default ProfileSetupWizard;

import { useState } from "react";
import Step1ProfileInfo from "./Step1ProfileInfo";
import Step2ProfileInfo from "./Step2ProfileInfo";
import Step3RoomOrRoomie from "./Step3RoomOrRoomie";
import Step4CreateListing from "./Step4CreateListing";
import Step5Questionnaire from "./Step5Questionnaire";
import { useSession } from "./SessionContext.jsx";

function ProfileSetupWizard() {
  const { session } = useSession();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const userId = session.userId;

  // Handle step data without sending to backend
  const handleStepData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));

    if (step < 5) {
      setStep((prev) => prev + 1);
    } else {
      // Only send to backend when all steps are complete
      submitCompleteProfile({ ...formData, ...newData });
    }
  };

  // Send all profile data to backend at once
  const submitCompleteProfile = async (completeData) => {
    // In submitCompleteProfile function, right before the fetch:
    console.log('Complete data being sent:', {
      step1: {
        bio: completeData.bio,
        profilePictureUrl: completeData.profilePictureUrl
      },
      step2: {
        workStatus: completeData.workStatus,
        // ... etc
      },
      step4: {
        listingType: completeData.listingType,
        // ... etc
      },
      step5: completeData.step5
    });
    if (!userId) return;

    try {
      const response = await fetch('/api/profile-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          step1: {
            bio: completeData.bio,
            profilePictureUrl: completeData.profilePictureUrl
          },
          step2: {
            workStatus: completeData.workStatus,
            student: completeData.student,
            pets: completeData.pets,
            pronouns: completeData.pronouns,
            lgbtq: completeData.lgbtq,
            genderIdentity: completeData.genderIdentity,
            genderPreference: completeData.genderPreference,
            lgbtqPreference: completeData.lgbtqPreference,
            smokingOptions: completeData.smokingOptions,
            hideWorkStatus: completeData.hideWorkStatus,
            hideStudent: completeData.hideStudent,
            hidePets: completeData.hidePets,
            hidePronouns: completeData.hidePronouns,
            hideLgbtq: completeData.hideLgbtq,
            hideGenderIdentity: completeData.hideGenderIdentity,
            hideGenderPreference: completeData.hideGenderPreference,
            hideLgbtqPreference: completeData.hideLgbtqPreference
          },
          step4: {
            listingType: completeData.listingType,
            rent: completeData.rent,
            budget_min: completeData.budget_min,
            budget_max: completeData.budget_max,
            available_date: completeData.available_date,
            move_in_min: completeData.move_in_min,
            move_in_max: completeData.move_in_max,
            tenancy_length: completeData.tenancy_length,
            stay_length: completeData.stay_length,
            location: completeData.location,
            preferred_location: completeData.preferred_location,
            flatmates_current: completeData.flatmates_current,
            flatmates_min: completeData.flatmates_min,
            flatmates_max: completeData.flatmates_max,
            flatmates_age_min: completeData.flatmates_age_min,
            flatmates_age_max: completeData.flatmates_age_max,
            flatmates_age_min_preferred: completeData.flatmates_age_min_preferred,
            flatmates_age_max_preferred: completeData.flatmates_age_max_preferred,
            womenOnlyHomeYN: completeData.womenOnlyHomeYN,
            lgbtqOnlyHomeYN: completeData.lgbtqOnlyHomeYN,
            description: completeData.description,
            photos: completeData.photos
          },
          step5: completeData.step5
        }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to save profile');

      console.log('Complete profile saved!', result);
      setIsComplete(true);
    } catch (err) {
      console.error('Profile save error:', err);
      alert('Could not save profile. Please try again.');
    }
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  if (isComplete) {
    return (
      <div className="profileSetupPage">
        <h1>🎉 Profile complete!</h1>
        <p>Your profile has been set up successfully.</p>
      </div>
    );
  }

  return (
    <div className="profileSetupPage">
      {step === 1 && <h1>Personalise Your Profile...</h1>}
      {step === 2 && <h1>Your Public Profile...</h1>}
      {step === 3 && <h1>What are you looking for?</h1>}
      {step === 4 && <h1>Create Your Listing...</h1>}
      {step === 5 && <h1>Roomie's Lifestyle Questionnaire...</h1>}

      <div className="profileSetupContainer">
        <h4>Step {step} of 5</h4>

        {step === 1 && (
          <Step1ProfileInfo
            onNext={handleStepData}
            defaultValues={{
              profilePicture: formData.profilePicture,
              bio: formData.bio,
            }}
          />
        )}

        {step === 2 && (
          <Step2ProfileInfo
            onNext={handleStepData}
            onPrevious={handlePrevious}
            defaultValues={{
              workStatus: formData.workStatus,
              student: formData.student,
              pets: formData.pets,
              pronouns: formData.pronouns,
              lgbtq: formData.lgbtq,
              genderIdentity: formData.genderIdentity,
              genderPreference: formData.genderPreference,
              lgbtqPreference: formData.lgbtqPreference,
              smokingOptions: formData.smokingOptions,
              hideWorkStatus: formData.hideWorkStatus,
              hideStudent: formData.hideStudent,
              hidePets: formData.hidePets,
              hidePronouns: formData.hidePronouns,
              hideLgbtq: formData.hideLgbtq,
              hideGenderIdentity: formData.hideGenderIdentity,
              hideGenderPreference: formData.hideGenderPreference,
              hideLgbtqPreference: formData.hideLgbtqPreference,
            }}
          />
        )}

        {step === 3 && (
          <Step3RoomOrRoomie
            onNext={handleStepData}
            onPrevious={handlePrevious}
            defaultValues={{
              listingType: formData.listingType,
            }}
          />
        )}

        {step === 4 && (
          <Step4CreateListing
            onNext={handleStepData}
            onPrevious={handlePrevious}
            listingType={formData.listingType}
            defaultValues={{
              rent: formData.rent,
              budget_min: formData.budget_min,
              budget_max: formData.budget_max,
              available_date: formData.available_date,
              move_in_min: formData.move_in_min,
              move_in_max: formData.move_in_max,
              tenancy_length: formData.tenancy_length,
              stay_length: formData.stay_length,
              location: formData.location,
              preferred_location: formData.preferred_location,
              flatmates_current: formData.flatmates_current,
              flatmates_min: formData.flatmates_min,
              flatmates_max: formData.flatmates_max,
              flatmates_age_min: formData.flatmates_age_min,
              flatmates_age_max: formData.flatmates_age_max,
              flatmates_age_min_preferred: formData.flatmates_age_min_preferred,
              flatmates_age_max_preferred: formData.flatmates_age_max_preferred,
              womenOnlyHomeYN: formData.womenOnlyHomeYN,
              lgbtqOnlyHomeYN: formData.lgbtqOnlyHomeYN,
              description: formData.description,
              photos: formData.photos,
            }}
          />
        )}

        {step === 5 && (
          <Step5Questionnaire
            onNext={handleStepData}
            onPrevious={handlePrevious}
            defaultValues={formData}
            userId={userId}
          />
        )}
      </div>
    </div>
  );
}

export default ProfileSetupWizard;