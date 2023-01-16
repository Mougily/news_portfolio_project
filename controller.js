const express = require("express")
const {fetchAllTopics} = require('./model');

const getTopics = (request, response, next) => {
    fetchAllTopics().then((topics) => {
        response.status(200).send({topics})
    }).catch((err) => {
        next(err)
    })
}

module.exports = {getTopics}