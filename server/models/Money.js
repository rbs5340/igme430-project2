const mongoose = require('mongoose');

const MoneySchema = new mongoose.Schema({
  points: {
    type: Number,
    default: 0,
  },
  clickValue: {
    type: Number,
    default: 1,
  },
  growthValue: {
    type: Number,
    default: 0,
  },
  premium: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

MoneySchema.statics.toAPI = (doc) => ({
  points: doc.points,
  clickValue: doc.clickValue,
  growthValue: doc.growthValue,
  premium: doc.premium,
});

const MoneyModel = mongoose.model('Money', MoneySchema);
module.exports = MoneyModel;
