# CCAPDEV MCO

## Instructions to Run
1. Install [Node.js](https://nodejs.org/en/download)
2. Open the terminal/command line to the root directory of the project
3. Type `npm init` and enter
4. Copy and paste the package install code from [Packages Installed](#packages-installed) and enter
5. Type `node server/app.js` and enter
6. Locate the http link from the output (i.e. Server running at http://localhost:3000) and open in the browser

## Packages Installed
```
npm install express
npm install nodemon
npm install mongoose
npm install express-handlebars
npm install dotenv
```
## External Sources
- for icons: https://fonts.google.com/icons?icon.size=24&icon.color=%23e8eaed&icon.platform=web

## File Structure
```
client/
├── assets/
│   └── defaulticon.png (placeholder user icon)
├── css/
│   ├── base/ (holds boilerplate css to be imported in all css files)
│   ├── components/ (for part specific css)
│   └── pages/
├── html/
│   ├── components/ (templates, injectable parts not directly associated with page content)
│   └── pages/
├── js/
│   ├── components/ (reusable code for other js files)
│   └── pages/

server/ (for express.js/database handling, saka na muna to)
├── app.js
├── api/ (mongoose schemas w/ getters and setters)
└── utils/
```