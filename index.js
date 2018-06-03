require('dotenv').config();
const readdirp = require('readdirp')
const config = require('./config');
const path = require('path');
const es = require('event-stream');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const JavaScriptObfuscator = require('javascript-obfuscator');
const minify = require('minify');
require('colors');

const { INPUT_DIR, OUTPUT_DIR } = process.env;

const copyManifestJSON = () => new Promise(async (resolve, reject) => {
  try {
    const f = 'manifest.json';
    const fText = await fs.readFileAsync(path.join(INPUT_DIR, f), 'utf-8');
    const outputFileDir = path.join(OUTPUT_DIR, f);
    await fs.writeFileAsync(outputFileDir, fText);
    console.log('Copied ' + 'manifest.json'.bold + ' to ' + OUTPUT_DIR.bold);
  } catch (error) {
    reject(error);
  }
});

const minifyCSSHTML = () => new Promise((resolve, reject) => {
  readdirp({
    root: path.join(INPUT_DIR),
    fileFilter: ['*.html', '*.css'],
    directoryFilter: ['!.git', '!*modules', '!lib', '!img', '!idea']
  },
    (fileInfo) => {},
    async (err, res) => {
      try {
        if (err) reject(err);
        const { files } = res;
        for (let i=0; i < files.length; i++) {
          const f = files[i].path;
          const fText = await fs.readFileAsync(path.join(INPUT_DIR, f), 'utf-8');
          const minified = minify(fText);
          const outputFileDir = path.join(OUTPUT_DIR, f);
          await fs.writeFileAsync(outputFileDir, minified);
          console.log('Minified ' + (i+1)+'/'+files.length+' '+f.bold);
        }
        console.log(files.length + ' files minified and saved to ' + OUTPUT_DIR.bold + ' via my (github.com/LA) fork of https://github.com/ianstormtaylor/minify\n');
        resolve();
      } catch (error) {
        reject(error);
      }
    }
  );
});

const copyLib = () => new Promise((resolve, reject) => {
  readdirp({
      root: path.join(INPUT_DIR),
      fileFilter: ['*.js'],
      directoryFilter: ['lib']
    },
    (fileInfo) => {},
    async (err, res) => {
      try {
        if (err) reject(err);
        const files = res.files.filter(el => el.path.includes('lib/'));
        for (let i=0; i < files.length; i++) {
          try {
            const f = files[i].path;
            const fText = await fs.readFileAsync(path.join(INPUT_DIR, f), 'utf-8');
            const outputFileDir = path.join(OUTPUT_DIR, f);
            await fs.writeFileAsync(outputFileDir, fText);
            console.log('Copied ' + (i+1)+'/'+files.length+' '+f.bold);
          } catch (error) {
            reject(error);
          }
        }
        console.log(files.length + ' files copied and saved to ' + OUTPUT_DIR.bold+'\n');
        resolve();
      } catch (error) {
        reject(error);
      }
    }
  );
});

const obfuscateJS = () => new Promise((resolve, reject) => {
  readdirp({
      root: path.join(INPUT_DIR),
      fileFilter: ['*.js'],
      directoryFilter: ['!lib']
    },
    (fileInfo) => {},
    async (err, res) => {
      try {
        if (err) reject(err);
        const { files } = res;
        for (let i=0; i < files.length; i++) {
          try {
            const f = files[i].path;
            const fText = await fs.readFileAsync(path.join(INPUT_DIR, f), 'utf-8');
            const obfuscationResult = JavaScriptObfuscator.obfuscate(fText, config.OBFUSCATE_OPTIONS);
            const outputFileDir = path.join(OUTPUT_DIR, f);
            await fs.writeFileAsync(outputFileDir, obfuscationResult);
            console.log('Obfuscated ' + (i+1)+'/'+files.length+' '+f.bold);
          } catch (error) {
            reject(error);
          }
        }
        console.log(files.length + ' files obfuscated and saved to ' + OUTPUT_DIR.bold + ' via https://github.com/javascript-obfuscator/javascript-obfuscator\n');
        resolve();
      } catch (error) {
        reject(error);
      }
    }
  );
});

(async () => {
  try {
    console.log('Launching...');
    await minifyCSSHTML();
    await obfuscateJS();
    await copyLib();
    await copyManifestJSON();
    console.log('\n' + '*'.repeat(60) + '\n' + '*'.repeat(60) + '\nCompleted.'.bold + ' ' + 'Built with fingers ' +'by github.com/LA'.bold + '\n' + '*'.repeat(60) + '\n' + '*'.repeat(60) + '\n\n');
  } catch (error) {
    console.log('error', error);
  }
})();

