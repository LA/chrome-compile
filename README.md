# chrome-compile

1. Clone `chrome-compile` into the same directory as your chrome extension project.
2. Duplicate your chrome extension project and add suffix `-prod` to the duplicated directory name.
3. cd into `chrome-compile` and run `npm install` or `yarn` to install the dependencies.
4. Edit `config.js` to change [https://obfuscator.io/](obfuscator.io) settings.
5. Create a `.env` file containing `INPUT_NAME=your_chrome_extension_project_name`, and then run `chrome-compile` with `npm start`.
