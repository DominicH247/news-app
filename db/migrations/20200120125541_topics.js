exports.up = function(knex) {
  console.log("creating topics table...");
  return knex.schema.createTable("topics", topicsTable => {
    topicsTable
      .string("topic_slug")
      .unique()
      .primary();
    topicsTable.string("topic_description").notNullable();
  });
};

exports.down = function(knex) {
  console.log("removing topics table...");
  return knex.schema.dropTable("topics");
};
