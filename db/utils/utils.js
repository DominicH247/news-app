exports.formatDates = list => {
  // check length of list
  if (list.length === 0) {
    return [];
  } else {
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
  }
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
