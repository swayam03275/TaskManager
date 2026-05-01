import app from "./app.js";
import { connectDb } from "./config/db.js";
import env from "./config/env.js";

const start = async () => {
  await connectDb();
  app.listen(env.port, () => {
    console.log(`API running on port ${env.port}`);
  });
};

start();
