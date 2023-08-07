const { Router } = require("express");
const { ClassifiedModel } = require("../models/Classified.model");
const { UserModel } = require("../models/User.model");

const classifiedRouter = Router();

classifiedRouter.post("/create", async (req, res) => {
  const { name, description, category, image, location, price } = req.body;
  const owner_id = req.user_id;
  const user = await UserModel.findOne({ _id: owner_id });

  const newClassified = new ClassifiedModel({
    name,
    description,
    category,
    image,
    location,
    price,
    owner_name: user.name,
    owner_email: user.email,
  });

  try {
    await newClassified.save();
    res.status(200).send("Classified Created");
  } catch (err) {
    console.error("Error saving classified:", err);
    res.status(500).send({ error: "Error saving classified." });
  }
});

classifiedRouter.delete("/delete/:classifiedID", async (req, res) => {
  const classifiedID = req.params.classifiedID;

  const user_id = req.user_id;
  const user = await UserModel.findOne({ _id: user_id });
  const user_email = user.email;

  const classified = await ClassifiedModel.findOne({ _id: classifiedID });
  const classified_owner_email = classified.owner_email;

  if (user_email !== classified_owner_email) {
    res.send("You are unauthorized to delete this classified.");
  } else {
    try {
      await ClassifiedModel.findByIdAndDelete(classifiedID);
      res.send(`Classified ${classifiedID} deleted`);
    } catch (err) {
      console.error("Error deleting classified:", err);
      res.status(500).send({ error: "Error deleting classified." });
    }
  }
});

module.exports = { classifiedRouter };
