#!/usr/bin/env node

const program = require('commander'),
      logger = require('../lib/logger'),
      swagger = require('../lib/swagger-client');

program
  .name('pos-cli logsv2 search')
  .arguments('[environment]', 'name of environment. Example: staging')
  .option('--sql <sql>', 'SQL query to fetch logs')
  .option('--size <size>', 'rows size', 10)
  .option('--from <from>', 'start from', 0)
  .option('--start_time <st>', 'starttime')
  .option('--end_time <et>', 'endtime')
  .option('--json', 'output as json')
  .action(async (environment) => {
    // try {
      const client = await swagger.SwaggerProxy.client(environment);

      client
        .getLogs(program)
        .then(response => {
          if (!program.json)
            swagger.search.printLogs(response)
          else
            console.log(response.body)
        })
        .catch(logger.Error)
    // } catch(e) { logger.Error(e.message) }
  });

program.parse(process.argv);
