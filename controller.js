const {fetchAllTopics, fetchAllArticles, fetchArticleComments, fetchSingleArticle, sendComment, changeVotes, fetchAllUsers, removeComment} = require('./model');



const getTopics = (request, response, next) => {
    fetchAllTopics().then((topics) => {
        response.status(200).send({topics})
    }).catch((err) => {
        next(err)
    })
}

const getArticles = (request, response, next) => {
    const {sort_by} = request.query
    const {order} = request.query
    const {topic} = request.query

    fetchAllTopics().then((acceptedTopics) => {
       return fetchAllArticles(sort_by, order, topic, acceptedTopics)
    }).then((articles) => {
        response.status(200).send({articles})
     }).catch((err) => {
         next(err)
     })
}

const getArticleComments = (request, response, next) => {
    const {article_id }= request.params
    fetchArticleComments(article_id).then((comments) => {
        response.status(200).send({comments})
    }).catch((err) => {
        next(err)
    })
}

const getArticleById = (request, response, next) => {
    const {article_id} = request.params
    fetchSingleArticle(article_id).then((article) => {
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


const getUsers = (request, response, next) => {
    fetchAllUsers().then((users) => {
        response.status(200).send({users})
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

const deleteComment = (request, response, next) => {
    const {comment_id} = request.params
    removeComment(comment_id).then(() => {
        response.status(204).send()
    }).catch((err) => {
        next(err)
    })
}

module.exports = {getTopics, getArticles, getArticleComments, getArticleById, postComment, getUsers, updateVotes, deleteComment}




