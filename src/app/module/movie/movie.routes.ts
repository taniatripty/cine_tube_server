import { Router } from "express";
import {
  createMovieController,
  getMovieByIdController,
  getMoviesController,
} from "./movie.controller";

const movieRoutes = Router();

movieRoutes.get("/movies", getMoviesController);
movieRoutes.get("/movies/:id", getMovieByIdController);
movieRoutes.post("/movies/create", createMovieController);

export default movieRoutes;