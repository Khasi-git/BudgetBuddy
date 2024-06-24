const express = require('express');
const admin = require("firebase-admin");
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// Enable CORS for all routes
app.use(cors());

// Firebase Admin SDK setup
const serviceAccount = require('./serviceAccountKey.json');

// Add necessary configurations
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(bodyParser.json());

// Import and use the routes from the "routes" folder
const routes = require('./routes');
app.use(routes);

const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});