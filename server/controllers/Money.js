const mongoose = require('mongoose');
const models = require('../models');

const { Money } = models;

const makerPage = async (req, res) => {
  res.render('app');
};

const makeMoney = async (req, res) => {
  console.log(`makeMoney: ${JSON.stringify(req.body)}`);

  const moneyDate = {
    owner: req.session.account._id,
  };

  try {
    const newMoney = new Money(moneyDate);
    await newMoney.save();
    return res.status(201).json({
      points: newMoney.points,
      clickValue: newMoney.clickValue,
      growthValue: newMoney.growthValue,
      premium: newMoney.premium,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured making Money!' });
  }
};

const getMoneys = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Money.find(query).select('points clickValue growthValue premium').lean().exec();

    return res.json({ moneys: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving money!' });
  }
};

const modMoney = async (req, res) => {
  const user = mongoose.Types.ObjectId.createFromHexString(req.session.account._id);
  if (req.body.moneys.length === 0) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
  const money = req.body.moneys[0];
  console.log(`modMoney: ${JSON.stringify(req.body)}`);
  // console.log(`User: ${user}`);
  try {
    await Money.updateMany(
      { owner: user },
      {
        $set: {
          points: money.points,
          clickValue: money.clickValue,
          growthValue: money.growthValue,
          premium: money.premium,
        },
      },
      { multi: true },
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
  makeMoney,
  getMoneys,
  modMoney,
};
