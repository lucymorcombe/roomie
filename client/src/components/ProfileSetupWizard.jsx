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

            {step === 1 && <Step1ProfileInfo onNext={handleStepData} defaultValues={formData} />}
            {step === 2 && (
                <Step2ProfileInfo
                onNext={handleStepData}
                onPrevious={handlePrevious}
                defaultValues={formData}
                />
            )}
            {step === 3 && (
                <Step3RoomOrRoomie
                onNext={handleStepData}
                onPrevious={handlePrevious}
                defaultValues={formData}
                />
            )}
            {step === 4 && (
                <Step4CreateListing
                onNext={handleStepData}
                onPrevious={handlePrevious}
                defaultValues={formData}
                />
            )}
            {step === 5 && (
                <Step5Questionnaire
                onNext={handleStepData}
                onPrevious={handlePrevious}
                defaultValues={formData}
                />
            )}
        </div>
    </div>
  );
}

export default ProfileSetupWizard