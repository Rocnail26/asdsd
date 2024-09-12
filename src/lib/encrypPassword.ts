const {hashSync} = require("bcrypt")

const password = hashSync("123456",10) 
console.log(password)



