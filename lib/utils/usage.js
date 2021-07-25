'use strict';

const os = require('os');
const _ = require('lodash');
const sentry = require('@sentry/node');

/**
 * Add properties from the package.json siapi key in the metadata
 * @param {object} metadata
 * @param {object} scope
 */
function addPackageJsonSiapiMetadata(metadata, scope) {
  const { packageJsonSiapi = {} } = scope;

  return _.defaults(metadata, packageJsonSiapi);
}

async function captureException(error) {
  try {
    sentry.captureException(error);
    await sentry.flush();
  } catch (err) {
    /** ignore errors*/
    return Promise.resolve();
  }
}

async function captureError(message) {
  try {
    sentry.captureMessage(message, 'error');
    await sentry.flush();
  } catch (err) {
    /** ignore errors*/
    return Promise.resolve();
  }
}

function captureStderr(name, error) {
  if (error && error.stderr && error.stderr.trim() !== '') {
    error.stderr
      .trim()
      .split('\n')
      .forEach(line => {
        sentry.addBreadcrumb({
          category: 'stderr',
          message: line,
          level: 'error',
        });
      });
  }

  return captureError(name);
}

function trackEvent(event, body) {}

function trackError({ scope, error }) {
  const { uuid } = scope;

  const properties = {
    error: typeof error == 'string' ? error : error && error.message,
    os: os.type(),
    platform: os.platform(),
    release: os.release(),
    version: scope.siapiVersion,
    nodeVersion: process.version,
    docker: scope.docker,
    useYarn: scope.useYarn,
  };

  try {
    return trackEvent('didNotCreateProject', {
      uuid,
      deviceId: scope.deviceId,
      properties: addPackageJsonSiapiMetadata(properties, scope),
    });
  } catch (err) {
    /** ignore errors*/
    return Promise.resolve();
  }
}

function trackUsage({ event, scope, error }) {
  return Promise.resolve();
}

module.exports = {
  trackError,
  trackUsage,
  captureException,
  captureStderr,
};
