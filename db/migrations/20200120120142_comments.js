exports.up = function(knex) {
  console.log("creating comments table...");
  return knex.schema.createTable("comments", commentsTable => {
    commentsTable.increment("comment_id").primary();
    commentsTable.string("comment_author").references("users.username");
    commentsTable.integer("article_id").references("articles.articles_id");
    commentsTable.integer("comment_vote");
    commentsTable
      .timestamp("created_at", { precision: 6 })
      .defaultTo(knex.fn.now(6));
    commentsTable.text("comment_body").notNullable();
  });
};

exports.down = function(knex) {
  console.log("dropping comments table...");
  return knex.schema.dropTable("commentsTable");
};
