const express = require("express")
const {fetchAllTopics, fetchAllArticles, fetchSingleArticle} = require('./model');

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

const getArticleById = (request, response, next) => {
    const id = request.params.article_id
    fetchSingleArticle(id).then((article) => {
        response.status(200).send({article})
    }).catch((err) => {
        console.log(err)
        next(err)
    })
}



  
module.exports = {getTopics, getArticles, getArticleById}