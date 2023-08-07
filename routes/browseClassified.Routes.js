const { Router } = require("express");
const { ClassifiedModel } = require("../models/Classified.model");

const browseClassifiedRouter = Router();

browseClassifiedRouter.get("/", async (req, res) => {
  try {
    const { category, sortBy, searchQuery, page } = req.query;
    const perPage = 4;
    const pageNumber = parseInt(page) || 1;

    const filter = {};
    if (category) {
      filter.category = category;
    }

    const searchRegex = new RegExp(searchQuery, "i");
    if (searchQuery) {
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
      ];
    }

    const sortOptions = {};
    if (sortBy === "date") {
      sortOptions.postedAt = -1;
    }

    const totalItems = await ClassifiedModel.countDocuments(filter);

    const classifieds = await ClassifiedModel.find(filter)
      .sort(sortOptions)
      .skip((pageNumber - 1) * perPage)
      .limit(perPage);

    res.status(200).json({ classifieds, totalItems, currentPage: pageNumber });
  } catch (error) {
    console.error("Error fetching classifieds:", error);
    res.status(500).json({ error: "Error fetching classifieds." });
  }
});

module.exports = { browseClassifiedRouter };
