function IsEmptyOrWhiteSpace(str) {
    return str===undefined ? true : (str.match(/^\s*$/) || []).length > 0;
  }
  export default IsEmptyOrWhiteSpace;
