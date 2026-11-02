#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/2dab200d69b7fa41fe7a850111c73a35af02672b3ce19610c3451b21dea92545/contract';
import startContract from '../../snapshots/2dab200d69b7fa41fe7a850111c73a35af02672b3ce19610c3451b21dea92545/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/59c10aa8eed64133d9eea1af93d9875429300636ced35b7d84e86c6eec0994c1/contract';
import endContract from '../../snapshots/59c10aa8eed64133d9eea1af93d9875429300636ced35b7d84e86c6eec0994c1/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'Genre',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isDeleted', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Person',
        columns: [
          col('biography', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isDeleted', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('photo', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Genre',
        constraint: 'Genre_name_key',
        columns: ['name'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Person',
        constraint: 'Person_name_key',
        columns: ['name'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
