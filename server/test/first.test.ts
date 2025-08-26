import { expect, test } from 'vitest';
import build from '../src/app';

test('server test', async () => {
  const app = await build();

  const response = await app.inject({
    method: 'GET',
    url: '/ping',
  });

  expect(response.statusCode).toBe(200);
});
