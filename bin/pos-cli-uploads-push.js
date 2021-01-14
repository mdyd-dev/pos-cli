#!/usr/bin/env node

const program = require('commander'),
  fs = require('fs'),
  ora = require('ora'),
  Gateway = require('../lib/proxy'),
  fetchAuthData = require('../lib/settings').fetchSettings,
  uploadFile = require('../lib/s3UploadFile').uploadFile,
  presignUrl = require('../lib/presignUrl').presignUrl,
  logger = require('../lib/logger');

const spinner = ora({ text: 'Sending file', stream: process.stdout, spinner: 'bouncingBar' });
const uploadZip = async (directory, gateway) => {
  spinner.start();
  const instanceId = (await gateway.getInstance()).id;
  const propertyUploadsDirectory = `instances/${instanceId}/property_uploads/data.property_upload_import.zip`;
  logger.Debug(propertyUploadsDirectory);
  try {
    const { uploadUrl } = await presignUrl(propertyUploadsDirectory, directory);
    await uploadFile(directory, uploadUrl);

    spinner.stopAndPersist().succeed('Upload done.');
  } catch (error) {
    logger.Debug(error);
    spinner.fail('Upload failed');
    logger.Error('Unable to upload archive file');
  }
};

program
  .name('pos-cli uploads push')
  .arguments('[environment]', 'name of the environment. Example: staging')
  .option('-p --path <path>', 'path of .zip file that contains files used in property of type upload', 'uploads.zip')
  .action((environment, params) => {
    const path = params.path;
    const authData = fetchAuthData(environment, program);
    Object.assign(process.env, { MARKETPLACE_TOKEN: authData.token, MARKETPLACE_URL: authData.url });

    if (!fs.existsSync(path)) logger.Error(`File not found: ${path}`);
    gateway = new Gateway(authData);
    uploadZip(path, gateway);
  });

program.parse(process.argv);
