# CCAPDEV MCO

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