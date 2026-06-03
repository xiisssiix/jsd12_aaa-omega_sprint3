import { Counter } from "./counter.model.js";

export const getNextSequence = async(sequenceName) => {
  const counter = await Counter.findOneAndUpdate({
    _id: sequenceName
  },
  {
    $inc: { seq: 1 }
  },
  {
    returnDocument: "after",
    upsert: true,
  });
  if (!counter) {
    throw new Error(`Cannot generate sequence: ${sequenceName}`);
  }
  return counter.seq;
};