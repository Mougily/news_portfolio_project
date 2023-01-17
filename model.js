const {db} = require('./db/connection');

const fetchAllTopics = () => {
    const sqlQuery = `SELECT * FROM topics`;

    return db.query(sqlQuery)
    .then((results) =>{
        return results.rows
    }).catch((err) => {
        next(err)
    })
}

const fetchAllArticles = (route) => {
console.log(route)

    const sqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
    FROM articles
    INNER JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`

    return db.query(sqlQuery)
    .then((result) => {
        if (result.rows.length === 0){
            return Promise.reject({status : 404, msg : 'Not found!'})
        }
        return result.rows
    }).catch((err) => {
        next(err)
    })
}

module.exports = {fetchAllTopics, fetchAllArticles}