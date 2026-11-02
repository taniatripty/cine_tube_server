import { readdirSync } from "node:fs";
import "dotenv/config";
import { definePrismaConfig } from "prisma/config";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";

const contractDirectory = "./prisma/contract";
const orm = ormConfig({
  contract: `${contractDirectory}/contract.prisma`,
  db: {
    connection: process.env["DATABASE_URL"]!,
  },
});
const contract = orm.contract;

if (!contract) {
  throw new Error("Prisma contract configuration was not created");
}

const contractInputs = readdirSync(new URL(`${contractDirectory}/`, import.meta.url))
  .filter((file) => file.endsWith(".prisma"))
  .map((file) => `${contractDirectory}/${file}`);

export default definePrismaConfig({
  orm: {
    ...orm,
    contract: {
      ...contract,
      source: {
        ...contract.source,
        inputs: contractInputs,
      },
    },
  },
  skills: {
    check: false,
  },
});