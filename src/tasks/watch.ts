/**
 * Name: watch.ts
 * Description: Watch for changes in Pug partials
 * Author: Ovidiu Barabula <lectii2008@gmail.com>
 * @since 1.0.0
 */

import chalk from 'chalk';
import * as path from 'path';
import { existsAsync } from '../util/functions';


// Custom error messages
const ERRORS = {
  NO_SOURCE: 'Pug source directory not found',
};


/**
 * Main task function
 * @param done Async callback function
 * @param pluginProvider Plugin utilities provider
 */
async function taskFn(done: any, { logger, config, paths, gulp }: any = {}) {
  const { sourceDir } = await config.get();
  // Pug source directory path
  const sourcePath = path.join(paths.sourceDir, sourceDir);

  if (!await existsAsync(sourcePath)) {
    return Promise.reject(new Error(`${ERRORS.NO_SOURCE} ${chalk.cyan(sourcePath)}`));
  }

  // Watch Pug partials and run pug:process
  logger.debug('Pug watcher started\u2026');
  return new Promise(() =>
    gulp.watch(`${sourcePath}/**/**.pug`, gulp.series('pug:process')));
}

/**
 * Task export object
 */
export default {
  // Meta description
  description: 'Watch for changes in Pug partials',
  hook: 'watch',
  name: 'pug:watch',
  taskFn,
};
