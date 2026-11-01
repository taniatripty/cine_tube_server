import { db } from "./src/app/lib/db";

async function main() {
  const movies = await db.orm.public.Movie.all();

  console.log(movies);

  await db.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
