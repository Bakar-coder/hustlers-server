if (process.env.NODE_ENV === 'production') return module.exports = { mongoURI: '' };
return module.exports = { mongoURI: 'mongodb://localhost:27017/rest-api' };