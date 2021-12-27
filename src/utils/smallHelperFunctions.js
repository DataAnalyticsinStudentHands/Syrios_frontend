export const ObjectInArray = (arr, obj) => {
  for (let i = 0; i < obj.length; i++) {
    if (arr[i] === obj) {
      return true;
    }
  }

  return false;
}
