const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the static files from the root directory
app.use(express.static(path.join(__dirname, '.')));

// Fallback route to serve the main portfolio HTML for unknown routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'franklin_portfolio.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
