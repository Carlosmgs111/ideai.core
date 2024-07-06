import mongoose from "mongoose";
import config from "../../../../config";

let test = true;
if (process.argv.includes("DEV") || process.argv.includes("PROD")) test = false;

const localURL = test ? config.mongoDBTestUrl : config.mongoDBLocalUrl;

export const connect = () =>
  mongoose.connect(localURL || config.mongoDBAtlasURL || "");

export const { connection } = mongoose;

// Callback once connection open
connection.once("open", () => {
  ("Mongodb connection stablished");
});

connection.on("error", (err) => {
  process.exit(0);
});
