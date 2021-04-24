const mongoose = require("mongoose");

const elementsSchema = new mongoose.Schema({
  atomicMass: Number,
  atomicNumber: {
    type: Number,
    max: 118,
    min: 1,
    unique: true,
  },
  discoveredBy: String,
  appearance: String,
  summary: String,
  boilingPoint: Number,
  density: Number,
  electronAffinity: Number,
  electronNegetavity: Number,
  electronicConfiguration: String,
  groupBlock: String,
  ionizationEnergies: [Number],
  meltingPoint: Number,
  oxidationStates: String,
  name: {
    type: String,
    required: [true, "An elements must have a name"],
  },
  symbol: {
    type: String,
    required: [true, "An elements must have a symbol"],
    maxLength: 3,
  },
  yearDiscovered: mongoose.Schema.Types.Mixed,
  standardState: String,
  vanDelWaalsRadius: Number,
  atomicRadius: Number,
  bondingType: String,
  namedBy: String,
  period: Number,
});

module.exports = mongoose.model("Element", elementsSchema);
