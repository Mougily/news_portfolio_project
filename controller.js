const express = require("express")
const {fetchAllTopics, fetchAllArticles} = require('./model');

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

module.exports = {getTopics, getArticles}