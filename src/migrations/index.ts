import * as migration_20250103_164552_init from './20250103_164552_init';

export const migrations = [
  {
    up: migration_20250103_164552_init.up,
    down: migration_20250103_164552_init.down,
    name: '20250103_164552_init'
  },
];
