require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const db = require("./db");
const cors = require("cors");

const app = express();

app.use(morgan("dev"));

app.use(cors());
app.use(express.json());

app.get("/api/v1/restaurants", async (req, res) => {
  try {
    // const results = await db.query("SELECT * FROM restaurants");
    const restaurantRatingsData = await db.query(
      "SELECT * FROM restaurants " +
        "LEFT JOIN (SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating),1) " +
        "AS avg_rating FROM reviews GROUP BY restaurant_id) reviews " +
        "ON restaurants.id = reviews.restaurant_id"
    );

    console.log("RESTAURANT DATA" + restaurantRatingsData);

    res.status(200).json({
      status: "success",
      results: restaurantRatingsData.rows.length,
      data: {
        restaurant: restaurantRatingsData.rows,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const restaurants = await db.query(
      "SELECT * FROM restaurants " +
        "LEFT JOIN (SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating),1) " +
        "AS avg_rating FROM reviews GROUP BY restaurant_id) reviews " +
        "ON restaurants.id = reviews.restaurant_id WHERE id = $1",
      [req.params.id]
    );

    const reviews = await db.query(
      "SELECT * FROM reviews WHERE restaurant_id = $1",
      [req.params.id]
    );

    res.status(200).json({
      status: "success",
      data: {
        restaurant: restaurants.rows[0],
        reviews: reviews.rows,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/v1/restaurants", async (req, res) => {
  const { name, location, price_range } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO restaurants(name, location, price_range) VALUES($1, $2, $3) returning *",
      [name, location, price_range]
    );

    res.status(201).json({
      status: "success",
      data: {
        restaurant: result.rows[0],
      },
    });
  } catch (error) {
    console.log(error);
  }
});

app.put("/api/v1/restaurants/:id", async (req, res) => {
  const { name, location, price_range } = req.body;
  try {
    const result = await db.query(
      "UPDATE restaurants SET name = $1, location = $2, price_range = $3 WHERE id = $4 returning *",
      [name, location, price_range, req.params.id]
    );

    res.status(200).json({
      status: "success",
      data: {
        restaurant: result.rows[0],
      },
    });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM restaurants WHERE id = $1", [
      req.params.id,
    ]);
    res.status(204).json({
      status: "success",
    });
  } catch (error) {}
});

app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
  const { name, review, rating } = req.body;

  try {
    const newReview = await db.query(
      "INSERT INTO reviews(restaurant_id, name, review, rating) VALUES ($1,$2,$3,$4) returning *",
      [req.params.id, name, review, rating]
    );
    console.log(newReview);
    res.status(201).json({
      status: "success",
      data: {
        review: newReview.rows[0],
      },
    });
  } catch (error) {
    console.log(error);
  }
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is up listening on port ${port}`);
});
