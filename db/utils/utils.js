exports.formatDates = list => {
  // duplicate list avoid mutation, extra precaution
  const dataCopy = [...list];

  // map thorugh list, modify created_at, return new array of objects
  const formattedList = dataCopy.map(item => {
    const formattedDate = new Date(item.created_at);

    const newObj = {
      ...item,
      created_at: formattedDate
    };

    return newObj;
  });

  return formattedList;
};

exports.makeRefObj = list => {
  const referenceObj = {};
  list.forEach(obj => {
    referenceObj[obj.title] = obj.article_id;
  });

  return referenceObj;
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(comment => {
    const formatted = {
      body: comment.body,
      article_id: articleRef[comment.belongs_to],
      author: comment.created_by,
      votes: comment.votes,
      created_at: new Date(comment.created_at)
    };
    return formatted;
  });
};
