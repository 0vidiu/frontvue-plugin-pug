/**
 * Name: process.ts
 * Description: Process Pug partials
 * Author: Ovidiu Barabula <lectii2008@gmail.com>
 * @since 1.0.0
 */

import chalk from 'chalk';
import * as plumber from 'gulp-plumber';
import * as pug from 'gulp-pug';
import * as pugLinter from 'gulp-pug-linter';
import * as path from 'path';
import { existsAsync } from '../util/functions';


// Custom error messages
const ERRORS = {
  NO_SOURCE_DIR: 'Make sure the Pug template files have been copied by running the <template> tasks',
};


/**
 * Main task function
 * @param done Async callback function
 * @param pluginProvider Plugin utilities provider
 */
async function taskFn(done: any, { logger, config, paths, env, gulp }: any = {}): Promise<any> {
  // TODO: Cache config related variables to run only one time
  const { buildDir, sourceDir } = await config.get();

  // Pug source directory
  const sourceDirPath: string = path.join(paths.sourceDir, sourceDir);
  // Compiled HTML path
  const dest: string = path.join(paths.buildDir, buildDir);

  // Check if Pug source directory exists
  let templateExists: boolean = false;
  try {
    templateExists = await existsAsync(dest);
  } catch (error) {
    return Promise.reject(new Error(`${ERRORS.NO_SOURCE_DIR} ${error.message}`));
  }

  return new Promise((resolve, reject) => {
    // Set the source path and filter unchanged files
    gulp.src(path.join(sourceDirPath, '/*.pug'), { since: gulp.lastRun(taskFn) })
      // Initialize gulp-plumber to prevent process termination in case of error
      .pipe(plumber({ errorHandler: error => logger.fatal(error.message) }))
      .pipe(pugLinter())
      .pipe(pugLinter.reporter((errors: any[]) => {
        if (errors.length > 0) {
          for (const error of errors) {
            logger.error(error);
          }
        }
      }))
      // Compile Pug files
      .pipe(pug({
        locals: {
          copyright: {
            year: (new Date()).getFullYear(),
          },
        },
      }))
      .pipe(plumber.stop())
      // Catch errors
      .on('error', (error: any) => {
        logger.fatal(error.message);
        reject();
      })
      // Output compiled CSS to file
      .pipe(gulp.dest(dest))
      // Resolve the promise when task finishes
      .on('end', resolve);
  });
}


/**
 * Task export object
 */
export default {
  description: 'Process Pug partials',
  hook: 'process',
  name: 'pug:process',
  taskFn,
};
