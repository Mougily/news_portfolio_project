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



module.exports = {fetchAllTopics}