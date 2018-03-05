require('dotenv').config();
const glob = require('multi-glob').glob
const config = require('./config');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const JavaScriptObfuscator = require('javascript-obfuscator');
const minify = require('minify');
require('colors');

const asyncForEach = async (array, callback) => {
  for (let i=0; i < array.length; i++) {
    await callback(array[i], i, array);
  }
}

const minifyCSSHTML = () => new Promise((resolve, reject) => {
  const globFileLocCSS = process.env.INPUT_DIR + config.CSS_FILE_GLOB_PATTERN;
  const globFileLocHTML = process.env.INPUT_DIR + config.HTML_FILE_GLOB_PATTERN;
  console.log('Grabbing [' + config.CSS_FILE_GLOB_PATTERN.bold + ', ' + config.HTML_FILE_GLOB_PATTERN.bold + '] pattern in ' + process.env.INPUT_DIR.bold);
  glob([globFileLocCSS, globFileLocHTML], async (er, files) => {
    await asyncForEach(files, async (f, i, arr) => {
      try {
        const fSlug = f.split(process.env.INPUT_DIR).join('');
        const fText = await fs.readFileAsync(f, 'utf-8');
        const minified = minify(fText);
        const outputFileDir = process.env.OUTPUT_DIR+fSlug;
        await fs.writeFileAsync(outputFileDir, minified);
        console.log('Minified ' + (i+1)+'/'+arr.length+' '+fSlug.bold);
      } catch (error) {
        reject(error);
      }
    });

    console.log(files.length + ' files minified and saved to ' + process.env.OUTPUT_DIR.bold + ' via my fork of https://github.com/ianstormtaylor/minify\n');
    resolve();
  });
});

const obfuscateJS = () => new Promise((resolve, reject) => {
  const globFileLocJS = process.env.INPUT_DIR + config.JS_FILE_GLOB_PATTERN;
  console.log('Grabbing ' + config.JS_FILE_GLOB_PATTERN.bold + ' pattern in ' + process.env.INPUT_DIR.bold);
  glob(globFileLocJS, async (er, files) => {
    await asyncForEach(files, async (f, i, arr) => {
      try {
        const fSlug = f.split(process.env.INPUT_DIR).join('');
        const fText = await fs.readFileAsync(f, 'utf-8');
        const obfuscationResult = JavaScriptObfuscator.obfuscate(fText, config.OBFUSCATE_OPTIONS);
        const outputFileDir = process.env.OUTPUT_DIR+fSlug;
        await fs.writeFileAsync(outputFileDir, obfuscationResult);
        console.log('Obfuscated ' + (i+1)+'/'+arr.length+' '+fSlug.bold);
      } catch (error) {
        reject(error);
      }
    });
    console.log(files.length + ' files obfuscated and saved to ' + process.env.OUTPUT_DIR.bold + ' via https://github.com/javascript-obfuscator/javascript-obfuscator\n');
    resolve();
  });
});

(async () => {
  try {
    console.log('Launching...');
    await minifyCSSHTML();
    await obfuscateJS();
    console.log('\n' + '*'.repeat(60) + '\n' + '*'.repeat(60) + '\nCompleted.'.bold + ' ' + 'Built with fingers ' +'by github.com/LA'.bold + '\n' + '*'.repeat(60) + '\n' + '*'.repeat(60) + '\n\n');
  } catch (error) {
    console.log('error', error);
  }
})();

