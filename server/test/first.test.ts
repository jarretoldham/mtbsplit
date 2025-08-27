import { expect, test, it } from 'vitest';
import build from '../src/app';

it('server test', async () => {
  const app = await build();

  const response = await app.inject({
    method: 'GET',
    url: '/ping',
  });

  expect(response.statusCode).toBe(200);
});
