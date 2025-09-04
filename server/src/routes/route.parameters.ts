/* 
Common :id validation parameter for routes
*/
export const ID_PARAM_SCHEMA = {
  schema: {
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer', minimum: 1 },
      },
      required: ['id'],
    },
  },
};
