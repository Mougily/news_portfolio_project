const { db } = require("./db/connection");

const fetchAllTopics = () => {
  const sqlQuery = `SELECT * FROM topics`;

  return db.query(sqlQuery).then((results) => {
    return results.rows;
  });
};

const fetchAllArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const acceptedOrders = ["ASC", "DESC"];
  const queryValues = [];
  const acceptedTopics = ["cats", "mitch", "paper"];
  const acceptedSortBys = [
    "created_at",
    "votes",
    "topic",
    "article_id",
    "title",
    "author",
    "article_img_url",
    "comment_count",
  ];
 if (!acceptedOrders.includes(order) || !acceptedSortBys.includes(sort_by)) {
    return Promise.reject({ status: 404, msg: "Not found!" });
  }
  if (topic !== undefined && !acceptedTopics.includes(topic)) {
    return Promise.reject({
      status: 404,
      msg: "Topic does not exist in the database!",
    });
  }
  let sqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;
  if (topic !== undefined) {
    sqlQuery += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  } else {
    queryValues.push(sort_by);
    queryValues.push(order);
    sqlQuery += ` GROUP BY articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url`;
    sqlQuery += ` ORDER BY articles.$2 $3 RETURNING*;`;
   console.log(queryValues, "QUERY VALS")
    return db.query(sqlQuery, queryValues).then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found!" });
      }
      console.log(result.rows)
      return result.rows;
    });
  }
};


// const sqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
// FROM articles
// LEFT JOIN comments ON articles.article_id = comments.article_id
// GROUP BY articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url
// ORDER BY articles.title ASC;`


const fetchArticleComments = (id) => {
  const sqlQuery = `SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at ASC;`;
  return db.query(sqlQuery, [id]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found!" });
    } else {
      return result.rows;
    }
  });
};

const fetchSingleArticle = (id) => {
  const sqlQuery = `SELECT * FROM articles
   WHERE article_id = $1`;
  return db.query(sqlQuery, [id]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found!" });
    } else {
      return result.rows;
    }
  });
};

const sendComment = (id, comment) => {
  const sqlQuery = `
INSERT INTO comments (article_id, author, body)
VALUES ($1, (SELECT username FROM users WHERE username = $2), $3)
RETURNING *;`;
  return db
    .query(sqlQuery, [id, comment.username, comment.body])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found!" });
      } else {
        return result.rows[0];
      }
    });
};

const fetchAllUsers = () => {
  const sqlQuery = `SELECT * FROM users;`;
  return db.query(sqlQuery).then((result) => {
    return result.rows;
  });
};

const changeVotes = (id, votes) => {
  const sqlQuery = `UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING*;`;

  return db.query(sqlQuery, [id, votes]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found!" });
    } else {
      return result.rows[0];
    }
  });
};
module.exports = {
  fetchAllTopics,
  fetchAllArticles,
  fetchSingleArticle,
  fetchArticleComments,
  sendComment,
  fetchAllUsers,
  changeVotes,
};
