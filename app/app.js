// Import express.js
import express from "express";
import path from "path";
import cors from "cors";
import session from "express-session";
import { fileURLToPath } from "url";
import multer from 'multer';
import fs from 'fs';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import db from './services/db.js';
import { User } from "./models/user.js";

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Add static files location
app.use(express.static("static"));

app.use(express.json());

app.use(session({
  secret: 'secretkeysdfjsflyoifasd',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 10 * 60 * 1000
  }
}));

////upload photo stuff

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'public', 'images', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename: timestamp + random number + original extension
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit per file
  }
});

// Single image upload endpoint (for profile pictures)
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Return the relative URL path that can be used in your app
    const imageUrl = `/images/uploads/${req.file.filename}`;
    res.json({ success: true, imageUrl: imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Multiple images upload endpoint (for listing photos)
app.post('/api/upload-images', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    // Return array of image URLs
    const imageUrls = req.files.map(file => `/images/uploads/${file.filename}`);
    res.json({ success: true, imageUrls: imageUrls });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Error handling middleware for multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files' });
    }
  }
  next(error);
});

// const SIMULATED_USER_ID = 1;

app.get("/api/room-listings", async (req, res) => {
    const userId = req.session?.user_id;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    const excludeSwiped = req.query.excludeSwiped === 'true';
    const includeOwn = req.query.includeOwn === 'true';  // Add this parameter
    
    try {
        let listings;
        if (excludeSwiped) {
            listings = await db.query(
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
        } else {
            if (includeOwn) {
                // For profile pages - get ALL listings including user's own
                listings = await db.query(`SELECT * FROM roomListings`);
            } else {
                // For main browsing - exclude user's own listings
                listings = await db.query(
                    `SELECT * FROM roomListings WHERE user_id != ?`,
                    [userId]
                );
            }
        }

        if (!listings.length) {
            console.log("No roomListings found");
            return res.json([]);
        }

        for (const listing of listings) {
            const photos = await db.query(
                "SELECT photo_url FROM listing_photos WHERE room_id = ?",
                [listing.room_id]
            );
            listing.photos = photos.map(p => p.photo_url);
        }

        res.json(listings);

    } catch (error) {
        console.error("Error fetching room listings:", error);
        res.status(500).json({ error: "Could not fetch listing" });
    }
});

app.get("/api/flatmate-listings", async (req, res) => {
    const userId = req.session?.user_id;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    const excludeSwiped = req.query.excludeSwiped === 'true';
    const includeOwn = req.query.includeOwn === 'true';  // Add this parameter
    
    try {
        let listings;
        if (excludeSwiped) {
            listings = await db.query(
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
        } else {
            if (includeOwn) {
                // For profile pages - get ALL listings including user's own
                listings = await db.query(`SELECT * FROM flatmateListings`);
            } else {
                // For main browsing - exclude user's own listings
                listings = await db.query(
                    `SELECT * FROM flatmateListings WHERE user_id != ?`,
                    [userId]
                );
            }
        }

        if (!listings.length) {
            console.log("No flatmateListings found");
            return res.json([]);
        }

        for (const listing of listings) {
            const photos = await db.query(
                "SELECT photo_url FROM listing_photos WHERE flatmate_id = ?",
                [listing.flatmate_id]
            );
            listing.photos = photos.map(p => p.photo_url);
        }

        res.json(listings);

    } catch (error) {
        console.error("Error fetching flatmate listings:", error);
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
              users.user_id AS userId,
              roomListings.location,
              roomListings.rent,
              roomListings.move_in_date_min,
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

          SELECT
              flatmateListings.flatmate_id AS listing_id,
              'flatmate' AS listing_type,
              users.user_id AS userId,
              flatmateListings.location,
              NULL AS rent,
              flatmateListings.move_in_date_min,
              flatmateListings.description,
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

// GET /api/users/:id/profile
app.get('/api/users/:id/profile', async (req, res) => {
  const userId = req.params.id;

  try {
    const sql = `
      SELECT 
        u.first_name,
        u.last_name,
        u.email,
        u.dob,
        u.user_id,
        p.bio,
        p.profile_picture_url,
        p.occupation,
        p.occupation_visible,
        p.student_status,
        p.student_status_visible,
        p.pet_owner,
        p.smoker_status,
        p.pronouns,
        p.pronouns_visible,
        p.lgbtq_identity,
        p.lgbtq_identity_visible,
        p.gender_identity,
        p.gender_identity_visible
      FROM users u
      LEFT JOIN profiles p ON u.user_id = p.user_id
      WHERE u.user_id = ?
    `;

    const result = await db.query(sql, [userId]);

    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result[0];

    res.json({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      dob: user.dob,
      userId: user.user_id,
      bio: user.bio,
      profilePicture: user.profile_picture_url,
      occupation: user.occupation,
      occupationVisible: user.occupation_visible,
      studentStatus: user.student_status,
      studentStatusVisible: user.student_status_visible,
      petOwner: user.pet_owner,
      smokerStatus: user.smoker_status,
      pronouns: user.pronouns,
      pronounsVisible: user.pronouns_visible,
      lgbtqIdentity: user.lgbtq_identity,
      lgbtqIdentityVisible: user.lgbtq_identity_visible,
      genderIdentity: user.gender_identity,
      genderIdentityVisible: user.gender_identity_visible,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Could not fetch user profile' });
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
  console.log('Incoming request body:', req.body);

  const userId = req.session?.user_id;
  if (!userId) return res.status(401).json({ error: 'Not logged in' });

  const { step1, step2, step3, step4, step5 } = req.body; // fullProfileData

  try {
    if (step1) {
  console.log('Processing step1...', step1);
  
  // Check if profile exists
  const existingProfile = await db.query(
    `SELECT user_id FROM profiles WHERE user_id = ?`,
    [userId]
  );
  
  if (existingProfile.length > 0) {
    // Profile exists, update it
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
  // else {
  //   // Profile doesn't exist, create it
  //   await db.query(
  //     `INSERT INTO profiles (user_id, bio, profile_picture_url, occupation, occupation_visible, student_status, 
  //     student_status_visible, pet_owner, smoker_status, pronouns, pronouns_visible, 
  //     lgbtq_identity, lgbtq_identity_visible, seeking_lgbtq_home, seeking_lgbtq_home_visible, 
  //     gender_identity, gender_identity_visible, seeking_women_only_home, seeking_women_only_home_visible) 
  //      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  //     [
  //       userId,
  //       step1.bio || '',
  //       step1.profilePictureUrl || null,
  //       null,
  //       1,
  //       null,
  //       1,
  //       0,
  //       null,
  //       null,
  //       1,
  //       0,
  //       1,
  //       0,
  //       1,
  //       null,
  //       1,
  //       0,
  //       1,
  //     ]
  //   );
  // }
  console.log('Step1 completed');
}

  if (step2) {
    console.log('Processing step2...', step2);
    
    // Check if profile exists (it should exist after step1, but just to be safe)
    const existingProfile = await db.query(
      `SELECT user_id FROM profiles WHERE user_id = ?`,
      [userId]
    );
    
    if (existingProfile.length > 0) {
      // Profile exists, update it
      await db.query(
        `UPDATE profiles SET 
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
          gender_identity = ?,
          gender_identity_visible = ?
        WHERE user_id = ?`,
        [
          step2.workStatus || null,
          step2.hideWorkStatus || null,
          step2.student === 'yes' ? 1 : 0,
          step2.hideStudent || null,
          step2.pets === 'yes' ? 1 : 0,
          step2.smokes === 'yes' ? 1 : 0,
          // step2.smokingOptions ? step2.smokingOptions.join(', ') : null,
          step2.pronouns || null,
          step2.hidePronouns || null,
          step2.lgbtq || null,
          step2.hideLgbtq || null,
          step2.genderIdentity || null,
          step2.hideGenderIdentity || null,
          userId
        ]
      );
    } else {
      // Profile doesn't exist, create it with step2 data
      await db.query(
        `INSERT INTO profiles 
        (user_id, bio, profile_picture_url, occupation, occupation_visible, student_status, student_status_visible, 
          pet_owner, smoker_status, pronouns, pronouns_visible, lgbtq_identity, 
          lgbtq_identity_visible, gender_identity, gender_identity_visible) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          step1.bio || '',
          step1.profilePictureUrl || null,
          step2.workStatus || null,
          step2.hideWorkStatus || null,
          step2.student === 'yes' ? 1 : 0,
          step2.hideStudent || null,
          step2.pets === 'yes' ? 1 : 0,
          step2.smokes === 'yes' ? 1 : 0,
          // step2.smokingOptions ? step2.smokingOptions.join(', ') : null,
          step2.pronouns || null,
          step2.hidePronouns || null,
          step2.lgbtq === 'yes' ? 1 : 0,
          step2.hideLgbtq || null,
          step2.genderIdentity || null,
          step2.hideGenderIdentity || null
        ]
      );
    }
    console.log('Step2 completed');
  }

    // Step 4
    if (step4) {
      if (step4.listingType === 'hasRoom') {
        // In your step4 processing, before any destructuring:
console.log('About to query roomListings...');

try {
  const queryResult = await db.query(
    `SELECT * FROM roomListings WHERE user_id = ?`,
    [userId]
  );
  
  console.log('Raw query result:', queryResult);
  console.log('Type of result:', typeof queryResult);
  console.log('Is array?', Array.isArray(queryResult));
  
  // Now handle the result appropriately
  let existing;
  if (Array.isArray(queryResult)) {
    existing = queryResult; // Use the result directly
  } else if (Array.isArray(queryResult[0])) {
    existing = queryResult[0]; // Use the first element if it's nested
  } else {
    existing = [];
  }
  
  console.log('Processed existing:', existing);
  console.log('Length:', existing.length);
  
} catch (error) {
  console.error('Query error:', error);
  throw error;
}
        const existing = await db.query(
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
              step4.womenOnlyHomeYN === 'yes' ? 1 : 0,
              step4.lgbtqOnlyHomeYN === 'yes' ? 1 : 0,
              userId
            ]
          );
          await db.query(`DELETE FROM listing_photos WHERE room_id = ?`, [roomId]);
        } else {
          const result = await db.query(
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
              step4.womenOnlyHomeYN === 'yes' ? 1 : 0,
              step4.lgbtqOnlyHomeYN === 'yes' ? 1 : 0
            ]
          );
          roomId = result.insertId;
        }

        if (step4.photos && Array.isArray(step4.photos) && step4.photos.length > 0) {
          if (step4.photos.length < 3 || step4.photos.length > 10) {
            throw new Error("You must submit between 3 and 10 photos.");
          }
          const photoInserts = step4.photos.map(photoUrl =>
            db.query(`INSERT INTO listing_photos (room_id, photo_url) VALUES (?, ?)`, [roomId, photoUrl])
          );
          await Promise.all(photoInserts);
        }

      } else if (step4.listingType === 'needsRoom') {
        const existing = await db.query(
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
              description = ?,
              seeking_women_only_household = ?,
              seeking_lgbtq_only_household = ?
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
              step4.seekingWomenOnlyHomeYN === 'yes' ? 1 : 0,
              step4.seekingLgbtqOnlyHomeYN === 'yes' ? 1 : 0,
              userId
            ]
          );
          await db.query(`DELETE FROM listing_photos WHERE flatmate_id = ?`, [flatmateId]);
        } else {
          const result = await db.query(
            `INSERT INTO flatmateListings
              (user_id, location, budget_min, budget_max, move_in_date_min, move_in_date_max, stay_length, num_flatmates_min, num_flatmates_max, age_range_min, age_range_max, description, seeking_women_only_household, seeking_lgbtq_only_household)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
              step4.description || null,
              step4.seekingWomenOnlyHomeYN === 'yes' ? 1 : 0,
              step4.seekingLgbtqOnlyHomeYN === 'yes' ? 1 : 0
            ]
          );
          flatmateId = result.insertId;
        }

        if (step4.photos && Array.isArray(step4.photos) && step4.photos.length > 0) {
          if (step4.photos.length < 3 || step4.photos.length > 10) {
            throw new Error("You must submit between 3 and 10 photos.");
          }
          const photoInserts = step4.photos.map(photoUrl =>
            db.query(`INSERT INTO listing_photos (flatmate_id, photo_url) VALUES (?, ?)`, [flatmateId, photoUrl])
          );
          await Promise.all(photoInserts);
        }
      }
    }

    // ✅ Step 5 goes *inside the same try block*
    // if (step5 && Array.isArray(step5)) {
    //   for (const ans of step5) {
    //     if (!ans.question_id || !ans.question_options_id) continue;

    //     const result = await db.query(
    //       `SELECT * FROM user_answers WHERE user_id = ? AND question_id = ?`,
    //       [userId, ans.question_id]
    //     );
    //     const existing = Array.isArray(result[0]) ? result[0] : result;

    //     if (existing.length > 0) {
    //       await db.query(
    //         `DELETE FROM user_answers WHERE user_id = ? AND question_id = ?`,
    //         [userId, ans.question_id]
    //       );
    //     }

    //     await db.query(
    //       `INSERT INTO user_answers 
    //         (user_id, question_id, question_options_id, answer_rank, created_at, updated_at)
    //       VALUES (?, ?, ?, NULL, NOW(), NOW())`,
    //       [userId, ans.question_id, ans.question_options_id]
    //     );
    //   }
    // }

    // ✅ Step 5 goes *inside the same try block*
  if (step5 && Array.isArray(step5)) {
    console.log('Processing step5...'); 
    console.log('step5 data:', step5);
    console.log('step5 length:', step5.length);
    
    for (const ans of step5) {
      console.log('Processing answer:', ans);
      
      if (!ans.question_id || !ans.question_options_id) continue;

      console.log('Querying existing answers...');
      const result = await db.query(
        `SELECT * FROM user_answers WHERE user_id = ? AND question_id = ?`,
        [userId, ans.question_id]
      );
      
      console.log('Query result type:', typeof result);
      console.log('Query result is array:', Array.isArray(result));
      console.log('Query result:', result);
      
      // This line might be causing the issue:
      const existing = Array.isArray(result[0]) ? result[0] : result;
      
      console.log('Processed existing:', existing);
      console.log('Existing length:', existing ? existing.length : 'undefined');

      if (existing.length > 0) {
        console.log('Deleting existing answers...');
        await db.query(
          `DELETE FROM user_answers WHERE user_id = ? AND question_id = ?`,
          [userId, ans.question_id]
        );
      }

      console.log('Inserting new answer...');
      await db.query(
        `INSERT INTO user_answers 
          (user_id, question_id, question_options_id, answer_rank, created_at, updated_at)
        VALUES (?, ?, ?, NULL, NOW(), NOW())`,
        [userId, ans.question_id, ans.question_options_id]
      );
    }
    console.log('Step5 completed successfully');
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