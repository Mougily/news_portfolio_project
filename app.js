const express = require('express');
const app = express();
const { getTopics, getArticles } = require('./controller')

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.all('*', (request, response, next) => {
    response.status(404).send({msg: 'Not found!'});
});

app.use((err, req, res, next) => {
    console.log(err.status)
    if (err.status === 404) {
        res.status(err.status).send({msg : "Not Found!"})
    } else {
        next(err)
    }
})

module.exports = app;