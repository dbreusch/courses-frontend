// utility to convert camel-case strings to sequence of capitalized words

export const splitCamelCase = (s) => {
  let t;
  if (s.length === 1) {
    t = s;
  } else {
    t = s
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, function (str) { return str.toUpperCase(); });
  }
  return t;
};
