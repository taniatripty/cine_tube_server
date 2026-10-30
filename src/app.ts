import express, { type Application } from "express";

const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.send(" Welcome to CineTube API");
});

export default app;
