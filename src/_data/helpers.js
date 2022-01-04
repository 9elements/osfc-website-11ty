const { DateTime } = require("luxon");
module.exports = {
  /**
   * Returns back some attributes based on wether the
   * link is active or a parent of an active item
   *
   * @param {String} itemUrl The link in question
   * @param {String} pageUrl The page context
   * @returns {String} The attributes or empty
   */
  getLinkActiveState(itemUrl, pageUrl) {
    let response = "";

    if (itemUrl === pageUrl) {
      response = ' aria-current="page"';
    }

    if (itemUrl.length > 1 && pageUrl.indexOf(itemUrl) === 0) {
      response += ' data-state="active"';
    }

    return response;
  },

  /**
   * Filters out the passed item from the passed collection
   * and randomises and limits them based on flags
   *
   * @param {Array} collection The 11ty collection we want to take from
   * @param {Object} item The item we want to exclude (often current page)
   * @param {Number} limit=3 How many items we want back
   * @param {Boolean} random=true Wether or not this should be randomised
   * @returns {Array} The resulting collection
   */
  getSiblingContent(collection, item, limit = 3, random = true) {
    let filteredItems = collection.filter((x) => x.url !== item.url);

    if (random) {
      let counter = filteredItems.length;

      while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        counter--;

        let temp = filteredItems[counter];

        // Swap the last element with the random one
        filteredItems[counter] = filteredItems[index];
        filteredItems[index] = temp;
      }
    }

    // Lastly, trim to length
    if (limit > 0) {
      filteredItems = filteredItems.slice(0, limit);
    }

    return filteredItems;
  },

  /**
   * Take an array of keys and return back items that match.
   * Note: items in the collection must have a key attribute in
   * Front Matter
   *
   * @param {Array} collection 11ty collection
   * @param {Array} keys collection of keys
   * @returns {Array} result collection or empty
   */
  filterCollectionByKeys(collection, keys) {
    return collection.filter((x) => keys.includes(x.data.key));
  },

  getDuration(start, end) {
    const startDateObject = DateTime.fromISO(start);
    const endDateObject = DateTime.fromISO(end);
    const diff = endDateObject.diff(startDateObject);

    return diff.as("minutes") + "min";
  },

  getDigits(value, number) {
    let str = value.toString();
    return str.substring(0, number);
  },

  trailingZeroes(num, size) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  },
  gravatarSize(url, size) {
    let newUrl = url;
    if (url.includes("https://www.gravatar.com")) {
      newUrl += "?s=";
      newUrl += size;
    }
    return newUrl;
  },

  /**
   * Sort a collection taking another array as model
   * Note: items in the collection must have an attribute in
   * Front Matter that is defined by sortingValue
   * Elements not present in the sorting array are put to the
   * end of the new collection.
   *
   * @param {Array} collection 11ty collection
   * @param {Array} sortingArr Array of Values
   * @param {String} sortingValue Defines the Value used for sorting
   * @returns {Array} result collection or empty
   */
  sortCollectionByArray(collection, sortingArr, sortingValue) {
    const sortedCollection = [];

    sortingArr.forEach((element) => {
      currentItem = collection.find(
        (entry) => entry.data[sortingValue] == element
      );
      if (currentItem) {
        sortedCollection.push(currentItem);
      }
    });

    const result = sortedCollection.concat(
      collection.filter(
        (entry) => !sortingArr.includes(entry.data[sortingValue])
      )
    );
    return result;
  },

  /**
   * Sort JSON DATA taking another array as model
   *
   * @param {Array} collection 11ty collection
   * @param {Array} sortingArr Array of Values
   * @param {String} sortingValue Defines the Value used for sorting
   * @returns {Array} result collection or empty
   */
  sortJsonByArray(collection, sortingArr, sortingValue) {
    const sortedCollection = [];

    sortingArr.forEach((element) => {
      currentItem = collection.find((entry) => entry[sortingValue] == element);
      if (currentItem) {
        sortedCollection.push(currentItem);
      }
    });

    const result = sortedCollection.concat(
      collection.filter((entry) => !sortingArr.includes(entry[sortingValue]))
    );
    return result;
  },
};
