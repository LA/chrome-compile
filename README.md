# chrome-compile

Clone `chrome-compile` into the same directory as your chrome extension project.

Duplicate your chrome extension project and add suffix `-prod` to the duplicated directory name.

cd into `chrome-compile` and run `npm install` or `yarn` to install the dependencies.

Edit `config.js` to change [https://obfuscator.io/](obfuscator.io) settings

Create a `.env` file containing `INPUT_NAME=your_chrome_extension_project_name`, and then run `chrome-compile` with `npm start`
