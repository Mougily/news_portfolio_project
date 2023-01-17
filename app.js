const express = require('express');
const app = express();
const { getTopics, getArticles, getArticleComments, getArticleById } = require('./controller')


app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id/comments', getArticleComments);
app.get('/api/articles/:article_id', getArticleById)

app.all('*', (request, response, next) => {
    response.status(404).send({msg: 'Not found!'});
});
// app.use((err, req, res, next) => {
//     if (err.status === 400) {
//         res.status(400).send({ msg: "Bad request!" });
//     } else if (err.status === 404) { 
//         res.status(404).send({ msg: "Not found!"});
//     } else {
//         next(err)
//     }
// });
app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({msg : err.msg})
    } else {
        next(err)
    }
    })

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg : "Bad request!"})
    } else {
        next(err)
    }
})


app.use((err, req, res, next) => {
        res.status(500).send({ msg: "Internal Server Error"});
});


module.exports = app;