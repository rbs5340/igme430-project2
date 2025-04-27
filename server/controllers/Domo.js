const mongoose = require('mongoose');
const models = require('../models');

const { Domo } = models;

const makerPage = async (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  // console.log("makedomo");
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Both name and age are required!' });
  }

  const domoDate = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoDate);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, points: newDomo.points });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making domo!' });
  }
};

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age points').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

const modDomo = async (req, res) => {
  const user = mongoose.Types.ObjectId.createFromHexString(req.session.account._id);
  console.log(`User: ${user}`);
  try {
    await Domo.updateMany(
      { owner: user },
      { $inc: { points: 1 } },
    );
    makerPage(req, res);
    return false;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  modDomo,
};
