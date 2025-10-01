function calculateAge(dob) {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function calculateCompatibilityScore(user, candidate) {
  let score = 0;
  console.log("=== Evaluating Candidate ===");

  user.pet_owner = user.pet_owner === 1 ? "yes" : "no";
  user.open_to_pets = user.open_to_pets === 1 ? "yes" : "no";
  candidate.pet_owner = candidate.pet_owner === 1 ? "yes" : "no";
  candidate.pets_accepted = candidate.pets_accepted === 1 ? "yes" : "no";
  
  user.seeking_lgbtq_only_household = user.seeking_lgbtq_only_household || 0;
user.seeking_women_only_household = user.seeking_women_only_household || 0;
candidate.lgbtq_only_household = candidate.lgbtq_only_household || 0;
candidate.women_only_household = candidate.women_only_household || 0;

  console.log("User listingType:", user.listingType);
  console.log("User pet_owner:", user.pet_owner, "open_to_pets:", user.open_to_pets);
  console.log("User prefs (seeking):", user.seeking_lgbtq_only_household, user.seeking_women_only_household);
  console.log("Candidate pet_owner:", candidate.pet_owner, "pets_accepted:", candidate.pets_accepted);

  if (user.listingType === "needsRoom") {
    if (user.pet_owner === "yes" && candidate.pets_accepted !== "yes") {
      console.log("Rejected: user has pet but candidate room does not accept pets");
      return null; 
    }
    if (user.open_to_pets === "no" && candidate.pet_owner === "yes") {
      console.log("Rejected: user not open to pets but candidate has a pet");
      return null;
    }
  }

  if (user.listingType === "hasRoom") {
    if (user.pet_owner === "yes" && candidate.open_to_pets !== "yes") {
      console.log("Rejected: user has pet but candidate flatmate not open to pets");
      return null; 
    }
    if (user.pets_accepted === "no" && candidate.pet_owner === "yes") {
      console.log("Rejected: room does not accept pets but candidate has pet");
      return null; 
    }
  }

  // --- Household preferences logic fixed ---
  if (user.listingType === "needsRoom") {
    if (user.seeking_lgbtq_only_household && candidate.lgbtq_only_household !== 1) {
      console.log("Rejected: user wants LGBTQ+ only but candidate room is not");
      return null;
    }
    if (user.seeking_women_only_household && candidate.women_only_household !== 1) {
      console.log("Rejected: user wants women only but candidate room is not");
      return null;
    }
  }

  if (user.smoker_status !== null && candidate.smoker_status !== null) {
    if (user.smoker_status === candidate.smoker_status) {
      console.log("Matched smoker status, +10");
      score += 10;
    }
  }

  if (user.listingType === "hasRoom") {
    const roomRent = user.rent || 0;
    const budgetMin = candidate.budget_min || 0;
    const budgetMax = candidate.budget_max || Infinity;
    
    if (roomRent > 0 && budgetMin <= roomRent && budgetMax >= roomRent) {
      console.log("Room rent matches candidate budget, +20");
      score += 20;
    }
  } else if (user.listingType === "needsRoom") {
    const budgetMin = user.budget_min || 0;
    const budgetMax = user.budget_max || Infinity;
    const roomRent = candidate.rent || 0;
    
    if (roomRent > 0 && budgetMin <= roomRent && budgetMax >= roomRent) {
      console.log("Candidate room rent matches user budget, +20");
      score += 20;
    }
  }

  try {
    let roomDate, flatmateMin, flatmateMax;
    
    if (user.listingType === "hasRoom") {
      roomDate = user.move_in_date_min;
      flatmateMin = candidate.move_in_date_min;
      flatmateMax = candidate.move_in_date_max;
    } else {
      roomDate = candidate.move_in_date_min;
      flatmateMin = user.move_in_date_min;
      flatmateMax = user.move_in_date_max;
    }

    if (roomDate && flatmateMin && flatmateMax) {
      const available = new Date(roomDate);
      const minDate = new Date(flatmateMin);
      const maxDate = new Date(flatmateMax);
      
      if (available >= minDate && available <= maxDate) {
        console.log("Move-in date matches, +10");
        score += 10;
      } else {
        console.log("Move-in date does not match");
      }
    }
  } catch (error) {
    console.log("Error checking move-in dates:", error);
  }

  let roomTenancy, flatmateStay;
  
  if (user.listingType === "hasRoom") {
    roomTenancy = user.tenancy_length || 0;
    flatmateStay = candidate.stay_length || 0;
  } else {
    roomTenancy = candidate.tenancy_length || 0;
    flatmateStay = user.stay_length || 0;
  }

  if (roomTenancy > 0 && flatmateStay > 0) {
    const difference = Math.abs(roomTenancy - flatmateStay);
    const lengthScore = Math.max(0, 15 - difference);
    console.log("Tenancy length difference:", difference, "+", lengthScore);
    score += lengthScore;
  }

  const userLoc = user.location || '';
  const candidateLoc = candidate.location || '';
  
  if (userLoc && candidateLoc) {
    if (userLoc.toLowerCase() === candidateLoc.toLowerCase()) {
      console.log("Exact location match, +10");
      score += 10;
    } else if (userLoc.toLowerCase().includes(candidateLoc.toLowerCase()) || 
               candidateLoc.toLowerCase().includes(userLoc.toLowerCase())) {
      console.log("Partial location match, +5");
      score += 5;
    }
  }

  // --- AGE SCORING (points-based, no rejection)
  try {
    const userAge = calculateAge(user.dob);
    const candidateAge = calculateAge(candidate.dob);
    
    const userAgeMin = user.age_range_min || 18;
    const userAgeMax = user.age_range_max || 65;
    const candidateAgeMin = candidate.age_range_min || 18;
    const candidateAgeMax = candidate.age_range_max || 65;

    if (candidateAge) {
      if (candidateAge >= userAgeMin && candidateAge <= userAgeMax) score += 30;
      else if (candidateAge === userAgeMin - 1 || candidateAge === userAgeMax + 1) score += 20;
      else if (candidateAge === userAgeMin - 2 || candidateAge === userAgeMax + 2) score += 10;
      console.log("Candidate age scoring + points:", score);
    }

    if (userAge) {
      if (userAge >= candidateAgeMin && userAge <= candidateAgeMax) score += 30;
      else if (userAge === candidateAgeMin - 1 || userAge === candidateAgeMax + 1) score += 20;
      else if (userAge === candidateAgeMin - 2 || userAge === candidateAgeMax + 2) score += 10;
      console.log("User age scoring + points:", score);
    }
  } catch (error) {
    console.log("Error checking age:", error);
  }

  if (user.answers && candidate.answers && 
      Object.keys(user.answers).length > 0 && 
      Object.keys(candidate.answers).length > 0) {
    
    console.log("Evaluating questionnaire answers");

    if (user.answers[1] && candidate.answers[1]) {
      const matches = user.answers[1].filter(a => candidate.answers[1].includes(a)).length;
      console.log("Q1 matches:", matches, "+", matches * 2);
      score += matches * 2;
    }

    const q3Scale = [
      "All the time – I want to be friends",
      "A few times a week", 
      "Only at weekends – I'm too busy in the week",
      "Occasionally – e.g. a shared meal or pub night",
      "Rarely – just polite small talk",
      "Never – I prefer to live totally independently"
    ];
    if (user.answers[3]?.[0] && candidate.answers[3]?.[0]) {
      const userAnswer = user.answers[3][0];
      const candidateAnswer = candidate.answers[3][0];
      if (userAnswer === candidateAnswer) {
        console.log("Q3 exact match +10");
        score += 10;
      } else {
        const userIndex = q3Scale.indexOf(userAnswer);
        const candidateIndex = q3Scale.indexOf(candidateAnswer);
        if (userIndex >= 0 && candidateIndex >= 0 && Math.abs(userIndex - candidateIndex) === 1) {
          console.log("Q3 near match +5");
          score += 5;
        }
      }
    }

    const q5Scale = [
      "I like a clear rota or system",
      "I just clean up after myself", 
      "I don't mind doing a bit extra if it needs it",
      "I don't want to share cleaning responsibilities"
    ];
    if (user.answers[5]?.[0] && candidate.answers[5]?.[0]) {
      const userAnswer = user.answers[5][0];
      const candidateAnswer = candidate.answers[5][0];
      if (userAnswer === candidateAnswer) {
        console.log("Q5 exact match +5");
        score += 5;
      } else {
        const userIndex = q5Scale.indexOf(userAnswer);
        const candidateIndex = q5Scale.indexOf(candidateAnswer);
        if (userIndex >= 0 && candidateIndex >= 0 && Math.abs(userIndex - candidateIndex) === 1) {
          console.log("Q5 near match +2");
          score += 2;
        }
      }
    }

    const q6Scale = [
      "They should be done immediately",
      "Same day is fine",
      "1–2 days is okay", 
      "Doesn't bother me"
    ];
    if (user.answers[6]?.[0] && candidate.answers[6]?.[0]) {
      const userAnswer = user.answers[6][0];
      const candidateAnswer = candidate.answers[6][0];
      if (userAnswer === candidateAnswer) {
        console.log("Q6 exact match +5");
        score += 5;
      } else {
        const userIndex = q6Scale.indexOf(userAnswer);
        const candidateIndex = q6Scale.indexOf(candidateAnswer);
        if (userIndex >= 0 && candidateIndex >= 0 && Math.abs(userIndex - candidateIndex) === 1) {
          console.log("Q6 near match +2");
          score += 2;
        }
      }
    }

    const q8Scale = [
      "9–5 from an office",
      "9–5 hybrid or from home",
      "Evening/night shifts", 
      "Variable hours or freelance",
      "Full-time student",
      "Unemployed/other"
    ];
    if (user.answers[8]?.[0] && candidate.answers[8]?.[0]) {
      const userAnswer = user.answers[8][0];
      const candidateAnswer = candidate.answers[8][0];
      if (userAnswer === candidateAnswer) {
        console.log("Q8 exact match +5");
        score += 5;
      } else {
        const userIndex = q8Scale.indexOf(userAnswer);
        const candidateIndex = q8Scale.indexOf(candidateAnswer);
        if (userIndex >= 0 && candidateIndex >= 0 && Math.abs(userIndex - candidateIndex) === 1) {
          console.log("Q8 near match +2");
          score += 2;
        }
      }
    }

    if (user.answers[10] && candidate.answers[10]) {
      const matches = user.answers[10].filter(a => candidate.answers[10].includes(a)).length;
      console.log("Q10 matches:", matches, "+", matches * 2);
      score += matches * 2;
    }

    // --- Q12 scoring (points-based)
    if (user.answers[12] && candidate.answers[12]) {
      const matches = user.answers[12].filter(a => candidate.answers[12].includes(a)).length;
      console.log("Q12 matches:", matches, "+", matches * 2);
      score += matches * 2;
    }
  } else {
    console.log("No questionnaire answers, +10");
    score += 10;
  }

  console.log("Final compatibility score:", score);
  console.log("==========================");
  return score;
}

export default calculateCompatibilityScore;
