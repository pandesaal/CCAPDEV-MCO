# CCAPDEV MCO

## Link to the Deployed Site: [archers-fw.onrender.com](https://archers-fw.onrender.com)

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
npm install mongoose
npm install express-handlebars
npm install dotenv
npm install uuid
npm install multer
npm install express-session
npm install connect-mongodb-session
npm install obscenity
npm install sharp
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
│   ├── components/ (handlebars partials)
│   └── pages/ (handlebars layouts)
├── js/
│   ├── components/ (reusable code for other js files/hbs components)
│   └── pages/ 
│
server/
├── app.js
├── controllers/ (getter/setter logic for interacting with MongoDB models)
├── models/ (MongoDB schemas for each table)
├── routes/
│   ├── index.js (container file for singular router export to app.js)
│   └── pages/ (page-specific routing logic)
└── utils/ (helper functions)
```