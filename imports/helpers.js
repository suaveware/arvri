export const makePath = (parts) =>
  parts.flatMap((url) => url.split("/")).join("/");

export const callMethod = (method, ...parameters) =>
  new Promise((resolve, reject) =>
    Meteor.call(method, ...parameters, (error, result) => {
      if (error) {
        reject(error);
      }

      resolve(result);
    })
  );

export const moveArrayItem = (array, fromIndex, toIndex) => {
  if (!(array[fromIndex] && array[toIndex])) {
    console.warning("Tried to move elements from out of bounds index:", {
      array,
      fromIndex,
      toIndex,
    });
    return;
  }

  const newArray = [...array];
  const moveItem = newArray[fromIndex];

  // https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
  newArray.splice(fromIndex, 1);
  newArray.splice(toIndex, 0, moveItem);

  return newArray;
};

export const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
};
