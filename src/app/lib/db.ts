import "dotenv/config";
import "temporal-polyfill/full/global";

import postgres from "@prisma/orm-postgres/runtime";
import { contractFromJson } from "@prisma/orm-postgres/static";

import type { Contract } from "../../../prisma/contract";

import contractJson from "../../../prisma/contract.json" with { type: "json" };

const contract = contractFromJson<Contract>(contractJson);

const databaseUrl = process.env["DATABASE_URL"];

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

export const db = postgres({
  contract,
  url: databaseUrl,
});
