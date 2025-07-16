const app = require('./src/app');
const connectDB = require('./src/config/db.config.js');

const PORT = process.env.PORT || 3000;

connectDB().then(async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to fetch access point URL', error);
    process.exit(1);
  }
});