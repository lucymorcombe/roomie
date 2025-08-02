// Import express.js
const express = require("express");

const path = require('path');

// Create express app
var app = express();


app.use('/images', express.static(path.join(process.cwd(), 'app/public/images')));

// Add static files location
app.use(express.static("static"));

app.use(express.json());

// Get the functions in the db.js file to use
const db = require('./services/db');

const SIMULATED_USER_ID = 1;

// Create a route for root - /
app.get("/", function(req, res) {
    res.send("Hello world!");
});

app.get("/api/room-listings", async (req, res) => {
    
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
            [SIMULATED_USER_ID, SIMULATED_USER_ID]
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
            [SIMULATED_USER_ID, SIMULATED_USER_ID]
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
  const userId = req.params.id;

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
  try {
    console.log('Getting likes for user', SIMULATED_USER_ID);
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
      [SIMULATED_USER_ID]
    );
    console.log('Likes query result:', likes);

    res.json(likes);
    } catch (error) {
      console.error("Error fetching likes:", error);
      res.status(500).json({ error: "Could not fetch likes" });
    }
  });


app.get('/api/matches', async (req, res) => {
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
                SIMULATED_USER_ID, SIMULATED_USER_ID, SIMULATED_USER_ID,
                SIMULATED_USER_ID, SIMULATED_USER_ID, SIMULATED_USER_ID
            ]
        );

        res.json(matches);
    } catch (error) {
        console.error("Error fetching matches:", error);
        res.status(500).json({ error: "Could not fetch matches" });
    }
});



// app.get("/listings", async (req, res) => {
//   try {
//     console.log("Fetching listings...");
//     const listings = await db.query("SELECT * FROM listings LIMIT 1");
//     console.log("Listings fetched:", listings);

//     if (!listings.length) {
//       console.log("No listings found");
//       return res.status(404).json({ error: "No listings found" });
//     }

//     const listing = listings[0];
//     console.log("Fetching photos for listing id:", listing.id);

//     const photos = await db.query(
//       "SELECT photo_url FROM listing_photos WHERE listing_id = ?",
//       [listing.listing_id]
//     );
//     console.log("Photos fetched:", photos);

//     listing.photos = photos.map(p => p.photo_url);
//     res.json([listing]);

//   } catch (error) {
//     console.error("Error fetching listing:", error);
//     res.status(500).json({ error: "Could not fetch listing" });
//   }
// });

// Create a route for testing the db
app.get("/db_test", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM test_table");
    res.json(results);
  } catch (error) {
    console.error("DB error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// Create a route for /goodbye
// Responds to a 'GET' request
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

// Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request
app.get("/hello/:name", function(req, res) {
    // req.params contains any parameters in the request
    // We can examine it in the console for debugging purposes
    console.log(req.params);
    //  Retrieve the 'name' parameter and use it in a dynamically generated page
    res.send("Hello " + req.params.name);
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});