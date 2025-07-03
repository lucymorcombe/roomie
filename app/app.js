// Import express.js
const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');

// Create a route for root - /
app.get("/", function(req, res) {
    res.send("Hello world!");
});

app.get("/listings", async (req, res) => {
  try {
    console.log("Fetching listings...");
    const listings = await db.query("SELECT * FROM listings LIMIT 1");
    console.log("Listings fetched:", listings);

    if (!listings.length) {
      console.log("No listings found");
      return res.status(404).json({ error: "No listings found" });
    }

    const listing = listings[0];
    console.log("Fetching photos for listing id:", listing.id);

    const photos = await db.query(
      "SELECT photo_url FROM listing_photos WHERE listing_id = ?",
      [listing.listing_id]
    );
    console.log("Photos fetched:", photos);

    listing.photos = photos.map(p => p.photo_url);
    res.json([listing]);

  } catch (error) {
    console.error("Error fetching listing:", error);
    res.status(500).json({ error: "Could not fetch listing" });
  }
});


// app.get("/listings", async (req, res) => {
//   try {
//     // Get 1 listing (update the table name if needed)
//     const listings = await db.query("SELECT * FROM listings LIMIT 1");
//     const listing = listings[0];

//     // Get photos for this listing
//     const photos = await db.query(
//       "SELECT photo_url FROM listing_photos WHERE listing_id = ?",
//       [listing.id]
//     );

//     // Add photos to the listing
//     listing.photos = photos.map(p => p.photo_url);

//     res.json(listing);
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