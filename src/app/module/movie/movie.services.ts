import { db } from "../../lib/db";

export interface CreateMovieInput {
  title: string;
  description: string;
  genre: string;
  releaseYear: number;
  director: string;
  mainActor: string;
  rating: number;
  streamingPlatform: string;
}

export const createMovie = (movie: CreateMovieInput) =>
  db.orm.public.Movie.create(movie);

export const getMovies = () =>
  db.orm.public.Movie.where({ isDeleted: false }).all();

export const getMovieById = (id: number) =>
  db.orm.public.Movie.where({ id, isDeleted: false }).first();