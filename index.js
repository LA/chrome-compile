require('dotenv').config();
const glob = require('glob');
const config = require('./config');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const JavaScriptObfuscator = require('javascript-obfuscator');
const colors = require('colors');

const asyncForEach = async (array, callback) => {
  for (let i=0; i < array.length; i++) {
    await callback(array[i], i, array);
  }
}

(async () => {
  try {
    const globFileLoc = process.env.INPUT_DIR + config.JS_FILE_GLOB_PATTERN;
    console.log('Launching...');
    console.log('Grabbing ' + config.JS_FILE_GLOB_PATTERN.bold + ' pattern in ' + process.env.INPUT_DIR.bold);
    glob(globFileLoc, async (er, files) => {
      await asyncForEach(files, async (f, i, arr) => {
        try {
          const fSlug = f.split(process.env.INPUT_DIR).join('');
          const fText = await fs.readFileAsync(f, 'utf-8');
          var obfuscationResult = JavaScriptObfuscator.obfuscate(fText, config.OBFUSCATE_OPTIONS);
          const outputFileDir = process.env.OUTPUT_DIR+fSlug;
          await fs.writeFileAsync(outputFileDir, obfuscationResult);
          process.stdout.clearLine();
          process.stdout.cursorTo(0);
          process.stdout.write('Obfuscated ' + (i+1)+'/'+arr.length+' '+fSlug.bold+'\n');
        } catch (error) {
          throw error;
        }
      });
      console.log(files.length + ' files obfuscated and saved to ' + process.env.OUTPUT_DIR.bold + ' via https://github.com/javascript-obfuscator/javascript-obfuscator');
    });
  } catch (error) {
    console.log('error', error);
  }
})();