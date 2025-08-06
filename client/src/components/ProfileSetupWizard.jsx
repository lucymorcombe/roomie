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
    <div>
      <h2>Step {step} of 5</h2>

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
      {/* Add previous to other steps similarly */}
    </div>
  );
}

export default ProfileSetupWizard