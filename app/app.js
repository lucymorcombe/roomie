// Import express.js
const express = require("express");
const path = require('path');
const cors = require('cors');
var app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true                 
}));

app.use(express.urlencoded({ extended: true }))
app.use('/images', express.static(path.join(process.cwd(), 'app/public/images')));

// Add static files location
app.use(express.static("static"));

app.use(express.json());

// Get the functions in the db.js file to use
const db = require('./services/db');

const { User } = require("./models/user");

var session = require('express-session');
app.use(session({
  secret: 'secretkeysdfjsflyoifasd',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    maxAge: 10 * 60 * 1000 
}
}));


// const SIMULATED_USER_ID = 1;

app.get("/api/room-listings", async (req, res) => {
    const userId = req.session?.user_id;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    try {
        const listings = await db.query(
            `
            SELECT * FROM roomListings
            WHERE user_id != ? 
            AND user_id NOT IN (
                SELECT liked_id FROM user_likes
                WHERE liker_id = ?
            )
            `,
            [userId, userId]
        );

        if (!listings.length) {
            console.log("No roomListings found");
            return res.json([]);
        }

        for (const listing of listings) {
            console.log("Listing ID for photos query:", listing.room_id);
            const photos = await db.query(
                "SELECT photo_url FROM listing_photos WHERE room_id = ?",
                [listing.room_id]
            );
            listing.photos = photos.map(p => p.photo_url);
            console.log("Mapped photo URLs:", listing.photos);
        }

        res.json(listings);

    } catch (error) {
        console.error("Error fetching listing:", error);
        res.status(500).json({ error: "Could not fetch listing" });
    }
});

app.get("/api/flatmate-listings", async (req, res) => {
    const userId = req.session?.user_id;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    try {
        const listings = await db.query(
            `
            SELECT * FROM flatmateListings
            WHERE user_id != ? 
            AND user_id NOT IN (
                SELECT liked_id FROM user_likes
                WHERE liker_id = ?
            )
            `,
            [userId, userId]
        );

        if (!listings.length) {
            console.log("No flatmateListings found");
            return res.json([]);
        }

        for (const listing of listings) {
            console.log("Listing ID for photos query:", listing.flatmate_id);
            const photos = await db.query(
                "SELECT photo_url FROM listing_photos WHERE flatmate_id = ?",
                [listing.flatmate_id]
            );
            listing.photos = photos.map(p => p.photo_url);
            console.log("Mapped photo URLs:", listing.photos);
        }

        res.json(listings);

    } catch (error) {
        console.error("Error fetching listing:", error);
        res.status(500).json({ error: "Could not fetch listing" });
    }
});

app.get('/api/users/:id/listing-type', async (req, res) => {
  const userId = req.session?.user_id;
  if (!userId) return res.status(401).json({ error: 'Not logged in' });


  try {
    const roomListing = await db.query(
      'SELECT 1 FROM roomListings WHERE user_id = ? LIMIT 1',
      [userId]
    );

    if (roomListing.length > 0) {
      res.json({ listingType: 'hasRoom' });
    } else {
      res.json({ listingType: 'needsRoom' }); 
    }
  } catch (error) {
    console.error('Error determining listing type:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/api/like', async (req, res) => {
  const userId = req.session?.user_id;
  if (!userId) return res.status(401).json({ error: 'Not logged in' });


  const { likerId, likedUserId, liked } = req.body;
  if (!likerId || !likedUserId || typeof liked !== 'boolean') {
    console.log('Bad request: missing or invalid data');
    return res.status(400).json({ error: 'Missing or invalid data' });
  }

  try {
    console.log(`Inserting/updating like: likerId=${likerId}, likedUserId=${likedUserId}, liked=${liked}`);
    // Your DB query here
    await db.query(
      'INSERT INTO user_likes (liker_id, liked_id, liked, created_at) VALUES (?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE liked = ?',
      [likerId, likedUserId, liked, liked]
    );

  let isMatch = false;

  if (liked) {
    console.log('Checking if reciprocal like exists...');
    const [existing] = await db.query(
      'SELECT liked FROM user_likes WHERE liker_id = ? AND liked_id = ? AND liked = TRUE',
      [likedUserId, likerId]
    );
    console.log('Reciprocal like query result:', existing);

    if (existing) {
        isMatch = true;
        console.log('Match found! Creating/updating user_matches...');

        const user1_id = likerId < likedUserId ? likerId : likedUserId;
        const user2_id = likerId < likedUserId ? likedUserId : likerId;

        
       const [rows] = await db.query(
          `SELECT GREATEST(
            (SELECT created_at FROM user_likes WHERE liker_id = ? AND liked_id = ?),
            (SELECT created_at FROM user_likes WHERE liker_id = ? AND liked_id = ?)
          ) AS max_created_at`,
          [likerId, likedUserId, likedUserId, likerId]
        );

        console.log('max_created_at rows:', rows);

        const max_created_at = rows[0]?.max_created_at ?? new Date();

        console.log('Latest like timestamp:', max_created_at);

        

        await db.query(
          `INSERT INTO user_matches (user1_id, user2_id, matched_at)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE matched_at = VALUES(matched_at)`,
          [user1_id, user2_id, max_created_at]
        );
        console.log('user_matches updated/inserted');
        } else {
          console.log('No reciprocal like found yet.');
        }
      }
    

    return res.status(200).json({
      message: 'Like recorded',
      match: isMatch
    });

    } catch (error) {
      console.error('Error saving like or match:', error);
      return res.status(500).json({ error: 'Could not record like or match' });
    }
});


app.get('/api/likes', async (req, res) => {
  const userId = req.session?.user_id;
  if (!userId) return res.status(401).json({ error: 'Not logged in' });

  try {
    console.log('Getting likes for user', userId);
    const likes = await db.query(
      `SELECT
        roomListings.*,
        users.first_name,
        listing_photos.photo_url AS first_photo,
        user_likes.created_at
      FROM user_likes
      JOIN users 
        ON users.user_id = user_likes.liker_id
      JOIN roomListings 
        ON roomListings.user_id = users.user_id
      LEFT JOIN (
        SELECT room_id, MIN(photo_url) AS photo_url
        FROM listing_photos
        WHERE photo_url LIKE '%bedroom%'
        GROUP BY room_id
      ) AS listing_photos 
        ON listing_photos.room_id = roomListings.room_id
      WHERE user_likes.liked_id = ?`,
      [userId]
    );
    console.log('Likes query result:', likes);

    res.json(likes);
    } catch (error) {
      console.error("Error fetching likes:", error);
      res.status(500).json({ error: "Could not fetch likes" });
    }
  });


app.get('/api/matches', async (req, res) => {
  const userId = req.session?.user_id;
  if (!userId) return res.status(401).json({ error: 'Not logged in' });

    try {
        const matches = await db.query(
            `
            SELECT
                roomListings.room_id AS listing_id,
                'room' AS listing_type,
                roomListings.location,
                roomListings.rent,
                roomListings.description,
                users.first_name,
                room_photos.room_photo_url AS first_photo,
                user_matches.matched_at
            FROM user_matches
            JOIN users 
                ON (users.user_id = user_matches.user1_id OR users.user_id = user_matches.user2_id)
                AND users.user_id != ?
            JOIN roomListings 
                ON roomListings.user_id = users.user_id
            LEFT JOIN (
                SELECT room_id, MIN(photo_url) AS room_photo_url
                FROM listing_photos
                WHERE photo_url LIKE '%bedroom%'
                GROUP BY room_id
            ) AS room_photos 
                ON room_photos.room_id = roomListings.room_id
            WHERE user_matches.user1_id = ? OR user_matches.user2_id = ?

            UNION ALL

            -- Matched user's flatmate listing (if they are looking for a room)
            SELECT
                flatmateListings.flatmate_id AS listing_id,
                'flatmate' AS listing_type,
                flatmateListings.location,
                NULL AS rent,
                flatmateListings.description AS description,
                users.first_name,
                flatmate_photos.flatmate_photo_url AS first_photo,
                user_matches.matched_at
            FROM user_matches
            JOIN users 
                ON (users.user_id = user_matches.user1_id OR users.user_id = user_matches.user2_id)
                AND users.user_id != ?
            JOIN flatmateListings 
                ON flatmateListings.user_id = users.user_id
            LEFT JOIN (
                SELECT flatmate_id, MIN(photo_url) AS flatmate_photo_url
                FROM listing_photos
                WHERE photo_url LIKE '%roomieListing%' AND photo_url LIKE '%_1%'
                GROUP BY flatmate_id
            ) AS flatmate_photos 
                ON flatmate_photos.flatmate_id = flatmateListings.flatmate_id
            WHERE user_matches.user1_id = ? OR user_matches.user2_id = ?
            `,
            [
                userId, userId, userId,
                userId, userId, userId
            ]
        );

        res.json(matches);
    } catch (error) {
        console.error("Error fetching matches:", error);
        res.status(500).json({ error: "Could not fetch matches" });
    }
});

//question grabber for questionnaire
// app.get('/api/questions', async (req, res) => {
//   try {
//     // 1. Get all questions
//     const [questions] = await db.query(
//       `SELECT question_id, question_text, question_type FROM questions ORDER BY question_id`
//     );

//     // 2. Get all options
//     const [options] = await db.query(
//       `SELECT question_options_id, question_id, option_text FROM question_options`
//     );

//     // 3. Attach options to each question
//     const questionsWithOptions = questions.map((q) => ({
//       ...q,
//       options: options.filter((o) => o.question_id === q.question_id),
//     }));

//     res.json(questionsWithOptions);
//   } catch (err) {
//     console.error('Failed to fetch questions:', err);
//     res.status(500).json({ error: 'Failed to fetch questions' });
//   }
// });

// GET /api/questions

app.get('/api/questions', async (req, res) => {
  try {
    const allowedIds = [1, 3, 5, 6, 8, 10, 12];

    // Convert IDs to a comma-separated string for SQL
    const idsStr = allowedIds.join(',');

    // Fetch only the selected questions
    const questionsResult = await db.query(
      `SELECT question_id, question_text, question_type 
       FROM questions 
       WHERE question_id IN (${idsStr})
       ORDER BY question_id`
    );
    const questions = Array.isArray(questionsResult[0]) ? questionsResult[0] : questionsResult;

    // Fetch only options for those questions
    const optionsResult = await db.query(
      `SELECT question_options_id, question_id, option_text 
       FROM question_options 
       WHERE question_id IN (${idsStr})`
    );
    const options = Array.isArray(optionsResult[0]) ? optionsResult[0] : optionsResult;

    // Attach options to their questions
    const questionsWithOptions = questions.map(q => ({
      ...q,
      options: options.filter(o => o.question_id === q.question_id)
    }));

    res.json(questionsWithOptions);

  } catch (err) {
    console.error('Failed to fetch questions:', err);
    res.status(500).json({ error: 'Failed to fetch questions', details: err.message });
  }
});




//Added routes to try and get login working:

app.get('/api/session', (req, res) => {
  if (req.session?.user_id) {
    res.json({
      loggedIn: true,
      userId: req.session.user_id,
      email: req.session.email,
      profileComplete: req.session.profileComplete || false,
    });
  } else {
    res.json({ loggedIn: false });
  }
});


app.get('/api/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const sql = `
      SELECT 
        users.first_name, 
        users.last_name, 
        users.email, 
        users.dob, 
        users.user_id 
      FROM users 
      WHERE users.user_id = ?
    `;

    const results = await db.query(sql, [userId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = results[0];

    res.json({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      dob: user.dob,
      user_id: user.user_id,
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Could not fetch user profile' });
  }
});

  
app.post('/api/set-password', async function (req, res) {
  console.log("BODY:", req.body);
  console.log("Incoming request body:", req.body); 

  const { first_name, last_name, dob, email, password } = req.body;

  // Log individual fields
  console.log('Parsed fields:', {
    first_name,
    last_name,
    dob,
    email,
    password,
  });

  // Quick check: are any required fields missing?
  if (!first_name || !last_name || !dob || !email || !password) {
    console.warn('Missing required fields');
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const user = new User(email);

  try {
    let user_id = await user.getIdFromEmail();

    if (user_id !== false) {
      // User exists — reject registration attempt
      return res.status(400).json({ success: false, error: 'Email already in use' });
    } else {
      // Create new user
      user_id = await user.addUser(first_name, last_name, dob, email, password);
    }


    // Log them in immediately
    req.session.user_id = user_id;
    req.session.loggedIn = true;

    // Store username/display name in session
    const sql = "SELECT email FROM users WHERE user_id = ?";
    const result = await db.query(sql, [user_id]);
    console.log("User info query result:", result);
    
    if (Array.isArray(result) && result.length > 0) {
      req.session.email = result[0].email;
    }

    res.json({ success: true, userId: user_id });
  } catch (err) {
    console.error('Error setting password:', err);

    // If the error is about undefined SQL params, call that out clearly
    if (err.message.includes('Bind parameters must not contain undefined')) {
      return res.status(500).json({ success: false, error: 'Internal error: invalid database values (undefined)' });
    }

    res.status(500).json({ success: false, error: 'Server error during registration' });
  }
});


// Check submitted email and password pair
app.post('/api/authenticate', async function (req, res) {
  const { email, password } = req.body;
  const user = new User(email);

  try {
    const user_id = await user.getIdFromEmail();
    if (user_id === false) {
      return res.status(401).json({ success: false, error: 'Invalid email' });
    }

    const match = await user.authenticate(password);
    if (!match) {
      return res.status(401).json({ success: false, error: 'Invalid password' });
    }

    // Set session
    req.session.user_id = user_id;
    req.session.loggedIn = true;
    req.session.email = email; 

    res.json({ success: true, userId: user_id, email: email });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Server error during login' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Could not log out' });
    }

    res.clearCookie('connect.sid'); // Optional: explicitly clear session cookie
    res.json({ message: 'Logged out successfully' });
  });
});

app.post('/api/profile-setup', async (req, res) => {
  const userId = req.session?.user_id;
  if (!userId) return res.status(401).json({ error: 'Not logged in' });

  const { step1, step2, step3, step4, step5 } = req.body; // fullProfileData

  try {
    if (step1) {
      await db.query(
        `UPDATE profiles 
          SET bio = ?,
              profile_picture_url = ?
        WHERE user_id = ?`,
        [
          step1.bio || '',
          step1.profilePictureUrl || null,
          userId
        ]
      );
    }

    if (step2) {
      await db.query(
        `UPDATE users SET 
          occupation = ?,
          occupation_visible = ?,
          student_status = ?,
          student_status_visible = ?,
          pet_owner = ?,
          smoker_status = ?,
          pronouns = ?, 
          pronouns_visible = ?,
          lgbtq_identity = ?, 
          lgbtq_identity_visible = ?, 
          seeking_lgbtq_home = ?, 
          seeking_lgbtq_home_visible = ?, 
          gender_identity = ?,
          gender_identity_visible = ?,
          seeking_women_only_home = ?,
          seeking_women_only_home_visible = ?
         WHERE user_id = ?`,
        [
          step2.workStatus || null,
          step2.hideWorkStatus || null,
          step2.student || null,
          step2.hideStudent || null,
          step2.pets || null,
          step2.smokingOptions.join(', ') || null,
          step2.pronouns || null,
          step2.hidePronouns || null,
          step2.lgbtq || null,
          step2.hideLgbtq || null,
          step2.lgbtqPreference || null,
          step2.hideLgbtqPreference || null,
          step2.genderIdentity || null,
          step2.hideGenderIdentity || null,
          step2.genderPreference || null,
          step2.hideGenderPreference || null,
          userId
        ]
      );
    }

    // Step 4
    if (step4) {
      if (step4.listingType === 'hasRoom') {
        const [existing] = await db.query(
          `SELECT * FROM roomListings WHERE user_id = ?`,
          [userId]
        );

        let roomId;
        if (existing.length > 0) {
          roomId = existing[0].room_id;
          await db.query(
            `UPDATE roomListings SET
              location = ?,
              rent = ?,
              move_in_date_min = ?,
              move_in_date_max = ?,
              tenancy_length = ?,
              num_flatmates = ?,
              age_range_min = ?,
              age_range_max = ?,
              description = ?,
              women_only_household = ?,
              lgbtq_only_household = ?
            WHERE user_id = ?`,
            [
              step4.location || null,
              step4.rent || null,
              step4.available_date || null,
              null,
              step4.tenancy_length || null,
              step4.flatmates_current || null,
              step4.flatmates_age_min || null,
              step4.flatmates_age_max || null,
              step4.description || null,
              step4.womenOnlyHomeYN || null,
              step4.lgbtqOnlyHomeYN || null,
              userId
            ]
          );
          await db.query(`DELETE FROM listing_photos WHERE room_id = ?`, [roomId]);
        } else {
          const [result] = await db.query(
            `INSERT INTO roomListings
              (user_id, location, rent, move_in_date_min, move_in_date_max, tenancy_length, num_flatmates, age_range_min, age_range_max, description, women_only_household, lgbtq_only_household)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              userId,
              step4.location || null,
              step4.rent || null,
              step4.available_date || null,
              null,
              step4.tenancy_length || null,
              step4.flatmates_current || null,
              step4.flatmates_age_min || null,
              step4.flatmates_age_max || null,
              step4.description || null,
              step4.womenOnlyHomeYN || null,
              step4.lgbtqOnlyHomeYN || null
            ]
          );
          roomId = result.insertId;
        }

        if (!step4.photos || step4.photos.length < 3 || step4.photos.length > 10) {
          throw new Error("You must submit between 3 and 10 photos.");
        }
        const photoInserts = step4.photos.map(photoUrl =>
          db.query(`INSERT INTO listing_photos (room_id, photo_url) VALUES (?, ?)`, [roomId, photoUrl])
        );
        await Promise.all(photoInserts);

      } else if (step4.listingType === 'needsRoom') {
        const [existing] = await db.query(
          `SELECT * FROM flatmateListings WHERE user_id = ?`,
          [userId]
        );

        let flatmateId;
        if (existing.length > 0) {
          flatmateId = existing[0].flatmate_id;
          await db.query(
            `UPDATE flatmateListings SET
              location = ?,
              budget_min = ?,
              budget_max = ?,
              move_in_date_min = ?,
              move_in_date_max = ?,
              stay_length = ?,
              num_flatmates_min = ?,
              num_flatmates_max = ?,
              age_range_min = ?,
              age_range_max = ?,
              description = ?
            WHERE user_id = ?`,
            [
              step4.preferred_location || null,
              step4.budget_min || null,
              step4.budget_max || null,
              step4.move_in_min || null,
              step4.move_in_max || null,
              step4.stay_length || null,
              step4.flatmates_min || null,
              step4.flatmates_max || null,
              step4.flatmates_age_min_preferred || null,
              step4.flatmates_age_max_preferred || null,
              step4.description || null,
              userId
            ]
          );
          await db.query(`DELETE FROM listing_photos WHERE flatmate_id = ?`, [flatmateId]);
        } else {
          const [result] = await db.query(
            `INSERT INTO flatmateListings
              (user_id, location, budget_min, budget_max, move_in_date_min, move_in_date_max, stay_length, num_flatmates_min, num_flatmates_max, age_range_min, age_range_max, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              userId,
              step4.preferred_location || null,
              step4.budget_min || null,
              step4.budget_max || null,
              step4.move_in_min || null,
              step4.move_in_max || null,
              step4.stay_length || null,
              step4.flatmates_min || null,
              step4.flatmates_max || null,
              step4.flatmates_age_min_preferred || null,
              step4.flatmates_age_max_preferred || null,
              step4.description || null
            ]
          );
          flatmateId = result.insertId;
        }

        if (!step4.photos || step4.photos.length < 3 || step4.photos.length > 10) {
          throw new Error("You must submit between 3 and 10 photos.");
        }
        const photoInserts = step4.photos.map(photoUrl =>
          db.query(`INSERT INTO listing_photos (flatmate_id, photo_url) VALUES (?, ?)`, [flatmateId, photoUrl])
        );
        await Promise.all(photoInserts);
      }
    }

    // ✅ Step 5 goes *inside the same try block*
    if (step5 && Array.isArray(step5)) {
      for (const ans of step5) {
        if (!ans.question_id || !ans.question_options_id) continue;

        const result = await db.query(
          `SELECT * FROM user_answers WHERE user_id = ? AND question_id = ?`,
          [userId, ans.question_id]
        );
        const existing = Array.isArray(result[0]) ? result[0] : result;

        if (existing.length > 0) {
          await db.query(
            `DELETE FROM user_answers WHERE user_id = ? AND question_id = ?`,
            [userId, ans.question_id]
          );
        }

        await db.query(
          `INSERT INTO user_answers 
            (user_id, question_id, question_options_id, answer_rank, created_at, updated_at)
          VALUES (?, ?, ?, NULL, NOW(), NOW())`,
          [userId, ans.question_id, ans.question_options_id]
        );
      }
    }

    res.json({ success: true });

  } catch (err) {
    console.error('Profile setup save error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});




// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});