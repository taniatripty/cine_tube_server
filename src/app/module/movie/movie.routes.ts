import { Router } from "express";
import { movieController } from "./movie.controller";

const movieRoutes = Router();

movieRoutes.get("/movies", movieController.getMovies);
movieRoutes.get("/movies/:id", movieController.getMovieById);
movieRoutes.post("/movies/create", movieController.createMovie);

export default movieRoutes;