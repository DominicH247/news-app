exports.up = function(knex) {
  console.log("creating articles table...");
  return knex.schema.createTable("articles", articlesTable => {
    articlesTable.increments("article_id").primary();
    articlesTable.string("article_title", [25]).notNullable();
    articlesTable.text("article_body").notNullable();
    articlesTable.integer("article_votes");
    articlesTable.string("topic").references("topics.topic_slug");
    articlesTable.string("article_author").references("users.username");
    articlesTable
      .timestamp("created_at", { precision: 6 })
      .defaultTo(knex.fn.now(6));
  });
};

exports.down = function(knex) {
  console.log("dropping articles table...");
  return knex.schema.dropTable("articles");
};
