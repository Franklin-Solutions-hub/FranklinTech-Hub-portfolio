const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the static files from the root directory
app.use(express.static(path.join(__dirname, '.')));

// Catch-all route to serve the main index.html for unknown routes (useful for SPAs)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'franklin_portfolio.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
