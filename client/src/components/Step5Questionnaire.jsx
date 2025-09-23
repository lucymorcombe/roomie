import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function Step5Questionnaire({ onNext, formData, userId }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit } = useForm({ defaultValues: {} });

  // Fetch questions + options
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch("/api/questions"); // returns [{question_id, question_text, question_type, options: [{question_options_id, option_text}]}]
        const data = await res.json();
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch questions", err);
      }
    }
    fetchQuestions();
  }, []);

  const onSubmit = (data) => {
    const answers = [];

    questions.forEach((q) => {
      const value = data[`q${q.question_id}`];
      if (!value) return; // skip if nothing selected

      if (q.question_type === "multi_choice") {
        // ensure value is always an array
        const selectedValues = Array.isArray(value) ? value : [value];

        selectedValues.forEach((optId) =>
          answers.push({
            user_id: userId,
            question_id: q.question_id,
            question_options_id: parseInt(optId),
          })
        );
      } else if (q.question_type === "single_choice") {
        answers.push({
          user_id: userId,
          question_id: q.question_id,
          question_options_id: parseInt(value),
        });
      }
    });

    // Send to backend
  //   fetch("/api/profile-setup", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ ...formData, step5: answers, userId }),
  //   })
  //     .then((res) => res.json())
  //     .then((result) => {
  //       if (result.success) {
  //         console.log("Step 5 saved!");
  //         onNext({ ...formData, step5: answers });
  //       } else {
  //         console.error(result.error);
  //       }
  //     })
  //     .catch((err) => console.error("Error submitting Step 5:", err));
  // };
    onNext({step5: answers});
};

  if (loading) return <p>Loading questionnaire...</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {Array.isArray(questions) && questions.map((q) => (
        <fieldset key={q.question_id}>
          <legend>{q.question_text}</legend>

          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {q.question_type === "multi_choice" &&
              Array.isArray(q.options) && q.options.map((opt) => (
                <label key={opt.question_options_id}>
                  <input
                    type="checkbox"
                    value={opt.question_options_id}
                    {...register(`q${q.question_id}`)}
                  />
                  {opt.option_text}
                </label>
              ))}

            {q.question_type === "single_choice" &&
              Array.isArray(q.options) && q.options.map((opt) => (
                <label key={opt.question_options_id}>
                  <input
                    type="radio"
                    value={opt.question_options_id}
                    {...register(`q${q.question_id}`)}
                  />
                  {opt.option_text}
                </label>
              ))}
            </div>
        </fieldset>
      ))}

      <button type="submit">Save & Submit</button>
    </form>
  );
}

export default Step5Questionnaire;
