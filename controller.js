const {fetchAllTopics, fetchAllArticles, fetchArticleComments, fetchSingleArticle, sendComment, changeVotes} = require('./model');


const getTopics = (request, response, next) => {
    fetchAllTopics().then((topics) => {
        response.status(200).send({topics})
    }).catch((err) => {
        next(err)
    })
}

const getArticles = (request, response, next) => {
    fetchAllArticles().then((articles) => {
        response.status(200).send({articles})
    }).catch((err) => {
        next(err)
    })
}

const getArticleComments = (request, response, next) => {
    const id = request.params.article_id
    fetchArticleComments(id).then((comments) => {
        response.status(200).send({comments})
    }).catch((err) => {
        next(err)
    })
}

const getArticleById = (request, response, next) => {
    const id = request.params.article_id
    fetchSingleArticle(id).then((article) => {
        response.status(200).send({article})
    }).catch((err) => {
       next(err)
    })
}

const postComment = (request, response, next) => {
    const id = request.params.article_id
    const newComment = request.body
    sendComment(id, newComment).then((comment) => {
        response.status(201).send({comment})
    }).catch((err) => {
        next(err)
    })
}

const updateVotes = (request, response, next) => {
const id = request.params.article_id
const votes = request.body.inc_votes
changeVotes(id, votes).then((article) => {
    response.status(200).send({article})
}).catch((err) => {
    next(err)
})
}
module.exports = {getTopics, getArticles, getArticleComments, getArticleById, postComment, updateVotes}

