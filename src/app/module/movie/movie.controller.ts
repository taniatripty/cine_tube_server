import type { RequestHandler } from "express";
import { createMovie, getMovieById, getMovies } from "./movie.services";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const createMovieController: RequestHandler = async (req, res) => {
  if (!isRecord(req.body)) {
    res.status(400).json({ error: "Request body must be a JSON object" });
    return;
  }

  const {
    title,
    description,
    genre,
    releaseYear,
    director,
    mainActor,
    rating,
    streamingPlatform,
  } = req.body;

  if (typeof title !== "string" || title.trim() === "") {
    res.status(400).json({ error: "title must be a non-empty string" });
    return;
  }
  if (typeof description !== "string" || description.trim() === "") {
    res.status(400).json({ error: "description must be a non-empty string" });
    return;
  }
  if (typeof genre !== "string" || genre.trim() === "") {
    res.status(400).json({ error: "genre must be a non-empty string" });
    return;
  }
  if (typeof releaseYear !== "number" || !Number.isInteger(releaseYear)) {
    res.status(400).json({ error: "releaseYear must be an integer" });
    return;
  }
  if (typeof director !== "string" || director.trim() === "") {
    res.status(400).json({ error: "director must be a non-empty string" });
    return;
  }
  if (typeof mainActor !== "string" || mainActor.trim() === "") {
    res.status(400).json({ error: "mainActor must be a non-empty string" });
    return;
  }
  if (typeof rating !== "number" || !Number.isFinite(rating)) {
    res.status(400).json({ error: "rating must be a finite number" });
    return;
  }
  if (
    typeof streamingPlatform !== "string" ||
    streamingPlatform.trim() === ""
  ) {
    res
      .status(400)
      .json({ error: "streamingPlatform must be a non-empty string" });
    return;
  }

  const movie = await createMovie({
    title: title.trim(),
    description: description.trim(),
    genre: genre.trim(),
    releaseYear,
    director: director.trim(),
    mainActor: mainActor.trim(),
    rating,
    streamingPlatform: streamingPlatform.trim(),
  });

  res.status(201).json({ data: movie });
};

export const getMoviesController: RequestHandler = async (_req, res) => {
  const movies = await getMovies();
  res.status(200).json({ data: movies });
};

export const getMovieByIdController: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    res.status(400).json({ error: "Movie id must be a positive integer" });
    return;
  }

  const movie = await getMovieById(id);
  if (!movie) {
    res.status(404).json({ error: "Movie not found" });
    return;
  }

  res.status(200).json({ data: movie });
};