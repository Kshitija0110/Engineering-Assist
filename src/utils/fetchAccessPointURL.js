const fetchAccessPointURL = async () => {
  return process.env.FLASK_URL;
};

module.exports = fetchAccessPointURL;