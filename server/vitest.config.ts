import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    // reads your ts config to resolve paths
    // https://vitest.dev/guide/common-errors.html#cannot-find-module-relative-path
    tsconfigPaths(),
  ],
  test: {
    environment: 'node',
    setupFiles: ['./test/db.client.mock.ts'],
  },
});
