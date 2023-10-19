#!/usr/bin/env node

const program = require('commander');
const ora = require('ora');
const semver = require('semver');
const fs = require('fs');
const path = require('path');
const Gateway = require('../lib/proxy');
const logger = require('../lib/logger');
const fetchAuthData = require('../lib/settings').fetchSettings;
const spinner = ora({ text: 'Setup', stream: process.stdout, spinner: 'bouncingBar' });
const files = require('../lib/files');
const { resolveDependencies } = require('../lib/modules/dependencies')

const posModulesFilePath = 'app/pos-modules.json';
const posModulesLockFilePath = 'app/pos-modules.lock.json';

const readLocalModules = () => {
  const config = files.readJSON(posModulesFilePath, { throwDoesNotExistError: true });
  return config['modules'];
};

program
  .name('pos-cli modules setup')
  .arguments('[environment]', 'name of the environment. Example: staging')
  .action(async (environment) => {
    const authData = fetchAuthData(environment, program);
    const gateway = new Gateway(authData);
    const progress = {};
    const errors = [];
    const lock = {
      modules: {}
    };

    progress.__moduleInfo = spinner.start('Loading module version info');
    const localModules = readLocalModules();
    if(!localModules) {
        progress.__moduleInfo.stop();
    } else {
      logger.Info('Resolving module dependencies', { hideTimestamp: true })
      lock['modules'] = await resolveDependencies(localModules, (list) => gateway.getModuleVersions(list));

      if (errors.length) {
        errors.map(e => logger.Warn(e, { hideTimestamp: true }));
        logger.Error('Some errors occured during module setup');
      } else {
        fs.writeFileSync(
          path.join(process.cwd(), posModulesLockFilePath),
          JSON.stringify(lock, null, 2)
        );
        logger.Info('Modules lock file created');
        progress.__moduleInfo.succeed(`Modules installed`);
      }
    }
  });

program.parse(process.argv);