import { useState } from "react";
import Step1ProfileInfo from "./Step1ProfileInfo";
import Step2ProfileInfo from "./Step2ProfileInfo";
import Step3RoomOrRoomie from "./Step3RoomOrRoomie";
import Step4CreateListing from "./Step4CreateListing";
import Step5Questionnaire from "./Step5Questionnaire";

function ProfileSetupWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const handleStepData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
    setStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

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
            defaultValues={{
              rent: formData.rent,
              budget_min: formData.budget_min,
              budget_max: formData.budget_max,
              available_date: formData.available_date,
              move_in_min: formData.move_in_min,
              move_in_max: formData.move_in_max,
              tenancy_length: formData.tenancy_length,
              stay_length_min: formData.stay_length_min,
              stay_length_max: formData.stay_length_max,
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
            defaultValues={formData}
          />
        )}
      </div>
    </div>
  );
}

export default ProfileSetupWizard;
