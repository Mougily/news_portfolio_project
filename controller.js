const express = require("express");
const { response } = require("./app");
const {fetchAllTopics, fetchAllArticles, fetchArticleComments} = require('./model');

const getTopics = (request, response, next) => {
    fetchAllTopics().then((topics) => {
        response.status(200).send({topics})
    }).catch((err) => {
        next(err)
    })
}

const getArticles = (request, response, next) => {
    const {path} = request.route
    console.log(path)
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

module.exports = {getTopics, getArticles, getArticleComments}