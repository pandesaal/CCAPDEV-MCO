# CCAPDEV MCO

## Packages Installed
```
npm install express
npm install mongoose
```

## External Sources
- for icons: https://fonts.google.com/icons?icon.size=24&icon.color=%23e8eaed&icon.platform=web

## File Structure
```
client/ (phase 1)
├── assets/
│   └── icons/
├── css/
│   ├── base/ (holds boilerplate css to be imported in all css files)
│   ├── components/ (for part specific css)
│   └── pages/
├── html/
│   ├── components/
│   └── pages/
├── js/
│   ├── components/ (reusable code for other js files)
│   └── pages/

server/ (for express.js/database handling, saka na muna to)
└── routes/
    ├── api/
    └── views/

```