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

type UpdateMovieInput = Partial<CreateMovieInput>;

type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; status: 400 | 404; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseMovieId(rawId: string | string[]): number | undefined {
  if (typeof rawId !== "string") {
    return undefined;
  }

  const id = Number(rawId);
  return Number.isSafeInteger(id) && id > 0 ? id : undefined;
}

function parseCreateMovieInput(payload: unknown): CreateMovieInput | string {
  if (!isRecord(payload)) {
    return "Request body must be a JSON object";
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
  } = payload;

  if (typeof title !== "string" || title.trim() === "") {
    return "title must be a non-empty string";
  }
  if (typeof description !== "string" || description.trim() === "") {
    return "description must be a non-empty string";
  }
  if (typeof genre !== "string" || genre.trim() === "") {
    return "genre must be a non-empty string";
  }
  if (typeof releaseYear !== "number" || !Number.isInteger(releaseYear)) {
    return "releaseYear must be an integer";
  }
  if (typeof director !== "string" || director.trim() === "") {
    return "director must be a non-empty string";
  }
  if (typeof mainActor !== "string" || mainActor.trim() === "") {
    return "mainActor must be a non-empty string";
  }
  if (typeof rating !== "number" || !Number.isFinite(rating)) {
    return "rating must be a finite number";
  }
  if (typeof streamingPlatform !== "string" || streamingPlatform.trim() === "") {
    return "streamingPlatform must be a non-empty string";
  }

  return {
    title: title.trim(),
    description: description.trim(),
    genre: genre.trim(),
    releaseYear,
    director: director.trim(),
    mainActor: mainActor.trim(),
    rating,
    streamingPlatform: streamingPlatform.trim(),
  };
}

function parseUpdateMovieInput(payload: unknown): UpdateMovieInput | string {
  if (!isRecord(payload)) {
    return "Request body must be a JSON object";
  }

  const entries = Object.entries(payload);
  if (entries.length === 0) {
    return "At least one movie field is required";
  }

  const movieInput: UpdateMovieInput = {};
  for (const [field, value] of entries) {
    switch (field) {
      case "title":
      case "description":
      case "genre":
      case "director":
      case "mainActor":
      case "streamingPlatform":
        if (typeof value !== "string" || value.trim() === "") {
          return `${field} must be a non-empty string`;
        }
        movieInput[field] = value.trim();
        break;
      case "releaseYear":
        if (typeof value !== "number" || !Number.isInteger(value)) {
          return "releaseYear must be an integer";
        }
        movieInput.releaseYear = value;
        break;
      case "rating":
        if (typeof value !== "number" || !Number.isFinite(value)) {
          return "rating must be a finite number";
        }
        movieInput.rating = value;
        break;
      default:
        return `Unknown movie field: ${field}`;
    }
  }

  return movieInput;
}

const createMovie = async (payload: unknown): Promise<ServiceResult<unknown>> => {
  const movieInput = parseCreateMovieInput(payload);
  if (typeof movieInput === "string") {
    return { success: false, status: 400, error: movieInput };
  }

  const movie = await db.orm.public.Movie.create(movieInput);
  return { success: true, data: movie };
};

const getMovies = () => db.orm.public.Movie.where({ isDeleted: false }).all();

const getMovieById = async (
  rawId: string | string[],
): Promise<ServiceResult<unknown>> => {
  const id = parseMovieId(rawId);
  if (id === undefined) {
    return {
      success: false,
      status: 400,
      error: "Movie id must be a positive integer",
    };
  }

  const movie = await db.orm.public.Movie.where({ id, isDeleted: false }).first();
  if (!movie) {
    return { success: false, status: 404, error: "Movie not found" };
  }

  return { success: true, data: movie };
};

const updateMovie = async (
  rawId: string | string[],
  payload: unknown,
): Promise<ServiceResult<unknown>> => {
  const id = parseMovieId(rawId);
  if (id === undefined) {
    return {
      success: false,
      status: 400,
      error: "Movie id must be a positive integer",
    };
  }

  const movieInput = parseUpdateMovieInput(payload);
  if (typeof movieInput === "string") {
    return { success: false, status: 400, error: movieInput };
  }

  const existingMovie = await db.orm.public.Movie.where({
    id,
    isDeleted: false,
  }).first();
  if (!existingMovie) {
    return { success: false, status: 404, error: "Movie not found" };
  }

  await db.orm.public.Movie.where({ id, isDeleted: false }).update(movieInput);
  const updatedMovie = await db.orm.public.Movie.where({
    id,
    isDeleted: false,
  }).first();

  if (!updatedMovie) {
    return { success: false, status: 404, error: "Movie not found" };
  }

  return { success: true, data: updatedMovie };
};

const deleteMovie = async (
  rawId: string | string[],
): Promise<ServiceResult<undefined>> => {
  const id = parseMovieId(rawId);
  if (id === undefined) {
    return {
      success: false,
      status: 400,
      error: "Movie id must be a positive integer",
    };
  }

  const existingMovie = await db.orm.public.Movie.where({
    id,
    isDeleted: false,
  }).first();
  if (!existingMovie) {
    return { success: false, status: 404, error: "Movie not found" };
  }

  await db.orm.public.Movie.where({ id, isDeleted: false }).update({
    isDeleted: true,
  });
  return { success: true, data: undefined };
};

export const movieService = {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
};
