#!/usr/bin/env node

const program = require('commander'),
      logger = require('../lib/logger'),
      swagger = require('../lib/swagger-client');

program
  .name('pos-cli logsv2 alerts trigger')
  .arguments('[environment]', 'name of environment. Example: staging')
  .option('--name <name>', 'alert name')
  .option('--json', 'output as json')
  .action(async (environment) => {
    try {
      const client = await swagger.SwaggerProxy.client(environment);
      const response = await client.triggerAlert(program)

      if (!program.json)
        console.log(response.body)
      else
        console.log(response.body)

    } catch(e) { logger.Error(e) }
  });

program.parse(process.argv);