export const descriptions = {
  BAD_REQUEST: 'Bad request',
  CONFLICT_NAME: 'Conflict entity name, is already in DB',
  CONFLICT_TRANSACTIONS:
    'Conflict relation transactions, has transactions in DB',
  CREATE_ENTITY: 'Create entity by schema',
  CREATE_CATEGORY: 'Create category for transactions',
  DELETE_ONEBY_ID: 'Delete entity by id',
  DELETE_ENTITY_NO_TRANSACTIONS: 'Delete entity, if it has no transactions',
  GET_ALL: 'Get all entities from DB',
  GET_ONEBY_ID: 'Get entity by id',
  GET_REPORT:
    'Get statistic/report by searched categories with total amount of ' +
    'all transaction from/to date',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  NOT_FOUND: 'Entity not found',
  UPDATE_ENTITY_UNIQUE_NAME: 'Update entity, property "name" is unique',
};
