'use strict';

/**
 * Expose main package JSON of the application
 * with basic info, dependencies, etc.
 */

module.exports = opts => {
  const {
    siapiDependencies,
    additionalsDependencies,
    siapiVersion,
    projectName,
    uuid,
    packageJsonSiapi,
  } = opts;

  // Finally, return the JSON.
  return {
    name: projectName,
    private: true,
    version: '0.1.0',
    description: 'A Siapi application',
    scripts: {
      develop: 'siapi develop',
      start: 'siapi start',
      build: 'siapi build',
      siapi: 'siapi',
    },
    devDependencies: {},
    dependencies: Object.assign(
      {},
      siapiDependencies.reduce((acc, key) => {
        acc[key] = `github:siapi-biru/${key}`;
        return acc;
      }, {}),
      additionalsDependencies
    ),
    author: {
      name: 'A Siapi developer',
    },
    siapi: {
      uuid: uuid,
      ...packageJsonSiapi,
    },
    engines: {
      node: '>=10.16.0 <=14.x.x',
      npm: '^6.0.0',
    },
    license: 'MIT',
  };
};
