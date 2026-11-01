import type { RequestHandler } from "express";
import { movieService } from "./movie.services";

const createMovie: RequestHandler = async (req, res) => {
  const result = await movieService.createMovie(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }

  res.status(201).json({
    success: true,
    message: "Movie created successfully",
    data: result.data,
  });
};

const getMovies: RequestHandler = async (_req, res) => {
  const movies = await movieService.getMovies();
  res.status(200).json({ data: movies });
};

const getMovieById: RequestHandler = async (req, res) => {
  const result = await movieService.getMovieById(req.params.id);
  if (!result.success) {
    res.status(result.status).json({ error: result.error });
    return;
  }

  res.status(200).json({ data: result.data });
};

export const movieController = {
  createMovie,
  getMovies,
  getMovieById,
};