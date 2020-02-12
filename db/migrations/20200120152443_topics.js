exports.up = function(knex) {
  return knex.schema.createTable("topics", topicsTable => {
    topicsTable
      .string("slug")
      .primary()
      .notNullable();
    topicsTable.string("description").notNullable();
    topicsTable.string("topic_icon").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("topics");
};
