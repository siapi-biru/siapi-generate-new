'use strict';

const execa = require('execa');

const { captureStderr } = require('./utils/usage');
const defaultConfigs = require('./utils/db-configs.js');
const clientDependencies = require('./utils/db-client-dependencies.js');
const createProject = require('./create-project');

module.exports = async function createQuickStartProject(scope) {
  console.log('Creating a quickstart project.');

  // get default sqlite config
  const client = 'sqlite';
  const configuration = {
    client,
    connection: defaultConfigs[client],
    dependencies: clientDependencies({ scope, client }),
  };

  await createProject(scope, configuration);

  if (scope.runQuickstartApp !== true) return;

  try {

    await execa('npm', ['run', 'build', '--', '--no-optimization'], {
      stdio: 'inherit',
      cwd: scope.rootPath,
      env: {
        FORCE_COLOR: 1,
      },
    });

  } catch (error) {

    await captureStderr('didNotBuildAdmin', error);
    process.exit(1);
  }

  console.log(`Running your Siapi application.`);

  try {
    await execa('npm', ['run', 'develop'], {
      stdio: 'inherit',
      cwd: scope.rootPath,
      env: {
        FORCE_COLOR: 1,
      },
    });
  } catch (error) {
    await captureStderr('didNotStartServer', error);
    process.exit(1);
  }
};
