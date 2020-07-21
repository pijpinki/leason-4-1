const express = require("express");
const connection = require("./database/connection");
const usersRouter = require("./router/public/users-router");
const commentsRouter = require("./router/private/comnents-router");
const auth = require("./middleware/auth");
const app = express();

async function main() {
  await connection.init();

  app.use(express.json());

  app.use("/users", usersRouter);
  app.use("/comments", auth, commentsRouter);

  app.listen(8080, err =>
    err ? console.error(err) : console.info("server started")
  );
}

main().catch(console.error);
