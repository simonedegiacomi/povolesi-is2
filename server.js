const app = require('./app');

const PORT = process.env.PORT || 3000;

app.on('databaseInitialized', () => {
    app.listen(PORT, () => console.log(`[APP] Listening on port ${PORT}`))
});