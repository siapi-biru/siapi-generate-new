'use strict';

const sqlClientModule = {
  sqlite: { sqlite3: '5.0.0' },
  postgres: { pg: '8.5.1' },
  mysql: { mysql: '2.18.1' },
};

/**
 * Client dependencies
 */
module.exports = ({ scope, client }) => {
  switch (client) {
    case 'sqlite':
    case 'postgres':
    case 'mysql':
      return {
        'siapi-connector-bookshelf': 'github:siapi-biru/siapi-connector-bookshelf',
        knex: '0.21.18',
        ...sqlClientModule[client],
      };
    case 'mongo':
      return {
        'siapi-connector-mongoose': scope.siapiVersion,
      };
    default:
      throw new Error(`Invalid client "${client}"`);
  }
};
