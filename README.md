# chrome-compile

Clone chrome compile into the same directory as your project.

Copy your chrome extension project and add suffix `-prod` to the directory name.

cd into the chrome-compile and run `npm install` or `yarn` to install the dependencies.

Edit `config.js` to change obfuscator.io settings

Create a `.env` file with `INPUT_NAME=your_chrome_extension_project_name`, and then run with `npm start`
