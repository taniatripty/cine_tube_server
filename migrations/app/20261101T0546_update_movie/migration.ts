#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/169677acc9c01f6b054f1af20189517d944eefc9de68f1fadb1c7000051f0d36/contract';
import startContract from '../../snapshots/169677acc9c01f6b054f1af20189517d944eefc9de68f1fadb1c7000051f0d36/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/2dab200d69b7fa41fe7a850111c73a35af02672b3ce19610c3451b21dea92545/contract';
import endContract from '../../snapshots/2dab200d69b7fa41fe7a850111c73a35af02672b3ce19610c3451b21dea92545/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit, sql } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'Movie',
        column: col('isDeleted', 'bool', {
          notNull: true,
          default: lit(false),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
      this.addColumnWithTemporaryDefault({
        schema: 'public',
        table: 'Movie',
        column: 'mainActor',
        type: 'text',
        temporaryDefault: sql`''`,
      }),
      this.addColumnWithTemporaryDefault({
        schema: 'public',
        table: 'Movie',
        column: 'rating',
        type: 'float8',
        temporaryDefault: sql`0`,
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
