/* require should be allowed */
const fs = require("node:fs");

/* Promise and ES6+ should be allowed */
export const myFunc = () => Promise.resolve(fs.readFileSync("foo.txt", "utf8"));

/* console should be allowed */
console.log(myFunc());
