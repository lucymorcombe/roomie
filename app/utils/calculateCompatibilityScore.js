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

  if (user.listingType === "needsRoom") {
    if (user.seeking_lgbtq_only_household && !candidate.lgbtq_only_household) {
      return null;
    }
    if (user.seeking_women_only_household && !candidate.women_only_household) {
      return null;
    }
    if (user.pet_owner && !candidate.pets_accepted) {
      return null;
    }
  }

  if (user.listingType === "hasRoom") {
    if (candidate.pet_owner && !user.pets_accepted) {
      return null;
    }
  }

  if (user.smoker_status !== null && candidate.smoker_status !== null) {
    if (user.smoker_status === candidate.smoker_status) {
      score += 10;
    }
  }

  if (user.listingType === "hasRoom") {
    const roomRent = user.rent || 0;
    const budgetMin = candidate.budget_min || 0;
    const budgetMax = candidate.budget_max || Infinity;
    
    if (roomRent > 0 && budgetMin <= roomRent && budgetMax >= roomRent) {
      score += 20;
    }
  } else if (user.listingType === "needsRoom") {
    const budgetMin = user.budget_min || 0;
    const budgetMax = user.budget_max || Infinity;
    const roomRent = candidate.rent || 0;
    
    if (roomRent > 0 && budgetMin <= roomRent && budgetMax >= roomRent) {
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
        score += 10;
      }
    }
  } catch (error) {
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
    score += lengthScore;
  }

  const userLoc = user.location || '';
  const candidateLoc = candidate.location || '';
  
  if (userLoc && candidateLoc) {
    if (userLoc.toLowerCase() === candidateLoc.toLowerCase()) {
      score += 10;
    } else if (userLoc.toLowerCase().includes(candidateLoc.toLowerCase()) || 
               candidateLoc.toLowerCase().includes(userLoc.toLowerCase())) {
      score += 5;
    }
  }

  try {
    const userAge = calculateAge(user.dob);
    const candidateAge = calculateAge(candidate.dob);
    
    const userAgeMin = user.age_range_min || 18;
    const userAgeMax = user.age_range_max || 65;
    const candidateAgeMin = candidate.age_range_min || 18;
    const candidateAgeMax = candidate.age_range_max || 65;
    
    if (candidateAge && (candidateAge < userAgeMin || candidateAge > userAgeMax)) {
      return null;
    }
    if (userAge && (userAge < candidateAgeMin || userAge > candidateAgeMax)) {
      return null;
    }
    
    if (userAge && candidateAge) {
      const ageDiff = Math.abs(userAge - candidateAge);
      if (ageDiff <= 3) {
        score += 10;
      } else if (ageDiff <= 5) {
        score += 7;
      } else if (ageDiff <= 10) {
        score += 5;
      } else {
        score += 2;
      }
    }
  } catch (error) {
  }

  if (user.answers && candidate.answers && 
      Object.keys(user.answers).length > 0 && 
      Object.keys(candidate.answers).length > 0) {
    
    if (user.answers[1] && candidate.answers[1]) {
      const matches = user.answers[1].filter(a => candidate.answers[1].includes(a)).length;
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
        score += 10;
      } else {
        const userIndex = q3Scale.indexOf(userAnswer);
        const candidateIndex = q3Scale.indexOf(candidateAnswer);
        if (userIndex >= 0 && candidateIndex >= 0 && Math.abs(userIndex - candidateIndex) === 1) {
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
        score += 5;
      } else {
        const userIndex = q5Scale.indexOf(userAnswer);
        const candidateIndex = q5Scale.indexOf(candidateAnswer);
        if (userIndex >= 0 && candidateIndex >= 0 && Math.abs(userIndex - candidateIndex) === 1) {
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
        score += 5;
      } else {
        const userIndex = q6Scale.indexOf(userAnswer);
        const candidateIndex = q6Scale.indexOf(candidateAnswer);
        if (userIndex >= 0 && candidateIndex >= 0 && Math.abs(userIndex - candidateIndex) === 1) {
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
        score += 5;
      } else {
        const userIndex = q8Scale.indexOf(userAnswer);
        const candidateIndex = q8Scale.indexOf(candidateAnswer);
        if (userIndex >= 0 && candidateIndex >= 0 && Math.abs(userIndex - candidateIndex) === 1) {
          score += 2;
        }
      }
    }

    if (user.answers[10] && candidate.answers[10]) {
      const matches = user.answers[10].filter(a => candidate.answers[10].includes(a)).length;
      score += matches * 2;
    }

    if (user.answers[12] && candidate.answers[12]) {
      const hasConflict = user.answers[12].some(a => candidate.answers[12].includes(a));
      if (hasConflict) {
        return null;
      }
    }
  } else {
    score += 10;
  }

  return score;
}

export default calculateCompatibilityScore;