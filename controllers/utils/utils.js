exports.paginatedResults = (model, modelStringName, page, limit) => {
  //PAGINATION

  // set default page number 1 and limit 10
  if (!page) {
    page = 1;
  }
  if (!limit) {
    limit = 10;
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  if (endIndex < model.length) {
    results.next = {
      page: page + 1,
      limit: limit
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit
    };
  }

  results[modelStringName] = model.slice(startIndex, endIndex);

  return results;
};
