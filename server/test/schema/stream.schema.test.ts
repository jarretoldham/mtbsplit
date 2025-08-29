import { StreamSchema, StreamsSchema } from 'schema/stream.schema';
import { describe, expect, it, test } from 'vitest';

describe('StreamsSchema', () => {
  it('should accept an array of streams with multiple types', () => {
    const validInput = [
      {
        type: 'LatLng',
        data: [
          [1, 2],
          [1, 3],
        ],
        size: 2,
      },
      {
        type: 'Distance',
        data: [1, 2, 3],
        size: 3,
      },
    ];

    const result = StreamsSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(validInput);
  });
  test('should accept an array of streams with multiple types', () => {
    const validInput = [
      {
        type: 'LatLng',
        data: [
          [1, 2],
          [1, 3],
        ],
        size: 2,
      },
      {
        type: 'Distance',
        data: [1, 2, 3],
        size: 3,
      },
      {
        type: 'Elevation',
        data: [100, 110, 120],
        size: 3,
      },
      {
        type: 'Speed',
        data: [5.5, 6.2, 4.8],
        size: 3,
      },
    ];

    const result = StreamsSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(validInput);
  });

  test('should reject invalid stream types', () => {
    const invalidInput = [
      {
        type: 'LatLng',
        data: [
          [1, 2],
          [1, 3],
        ],
        size: 2,
      },
      {
        type: 'InvalidType',
        data: [1, 2, 3],
        size: 3,
      },
    ];

    const result = StreamsSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('StreamSchema', () => {
  it.each(['Elevation', 'Distance', 'Speed', 'Altitude'])(
    'StreamSchema should accept valid $type stream',
    (streamType) => {
      const validStream = {
        type: streamType,
        data: [],
        size: 0,
      };
      const result = StreamSchema.safeParse(validStream);
      if (!result.success) {
        console.error('Validation errors:', result.error);
      }
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validStream);
    },
  );
});
