import express, { type Application } from "express";
import movieRoutes from "./app/module/movie/movie.routes";

const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/v1", movieRoutes);

app.get("/", (_req, res) => {
  res.send(" Welcome to CineTube API");
});

export default app;
