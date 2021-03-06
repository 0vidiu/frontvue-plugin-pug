/**
 * Name: config.ts
 * Description: Config Pug plugin
 * Author: Ovidiu Barabula <lectii2008@gmail.com>
 * @since 1.0.0
 */

import chalk from 'chalk';
import * as plumber from 'gulp-plumber';
import * as path from 'path';
import configDefaults from '../config/config-defaults';
import configQuestionnaire from '../config/config-questionnaire';
import { existsAsync } from '../util/functions';


// Custom messages
const STRINGS = {
  CONFIG_EXISTS: 'Pug config file already exists',
  COPYING_PUG_CONFIG: 'Copying Pug config file to',
};

// Custom error messages
const ERRORS = {
  COPY_FAILED: 'Copying Pug config file failed',
};


/**
 * Main task function
 * @param done Async callback function
 * @param pluginProvider Plugin utilities provider
 */
async function taskFn(done: any, { logger, paths, gulp }: any = {}): Promise<any> {
  const configFilename = '.pug-lintrc';
  const templateDir: string = path.join(paths.cwd, '/node_modules/@frontvue/plugin-pug/template');
  const dest: string = path.join(paths.cwd);

  // Perform a directory check to avoid overwriting existing files
  let isCopied: boolean = false;
  try {
    isCopied = await existsAsync(path.join(dest, configFilename));
  } catch (error) {
    return Promise.reject(new Error(`${ERRORS.COPY_FAILED} ${error.message}`));
  }

  // If the config file are already copied, or folder already exists, exit
  if (isCopied) {
    logger.debug(STRINGS.CONFIG_EXISTS);
    return Promise.resolve();
  }

  logger.debug(`${STRINGS.COPYING_PUG_CONFIG} ${chalk.cyan.bold(path.join(dest, configFilename))}`);
  return new Promise((resolve, reject) => {
    gulp.src(path.join(templateDir, configFilename), { dot: true })
      // Initialize gulp-plumber to prevent process termination in case of error
      .pipe(plumber({ errorHandler: error => logger.fatal(error.message) }))
      .on('error', (error: any) => {
        logger.fatal(error.message);
        reject();
      })
      .pipe(plumber.stop())
      .pipe(gulp.dest(dest))
      .on('end', resolve);
  });
}


/**
 * Task export object
 */
export default {
  // Meta description
  description: 'Configure Pug plugin',
  hook: 'config',
  name: 'pug:config',
  taskFn,

  // Configuration
  configDefaults,
  configQuestionnaire,
};
