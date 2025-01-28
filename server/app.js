const express = require('express');
const path = require('path')
const app = express();
const PORT = 3000;


// Define routes
app.get('/', (req, res) => {
  res.send("HGSDFJGSDF");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


