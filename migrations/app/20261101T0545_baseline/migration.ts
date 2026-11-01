#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/169677acc9c01f6b054f1af20189517d944eefc9de68f1fadb1c7000051f0d36/contract';
import endContract from '../../snapshots/169677acc9c01f6b054f1af20189517d944eefc9de68f1fadb1c7000051f0d36/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey, sql } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Movie',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('director', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('genre', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('releaseYear', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('streamingPlatform', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
