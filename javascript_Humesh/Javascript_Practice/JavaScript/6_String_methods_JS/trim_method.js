let first_name = " Jain       ";


console.log(first_name.length); // 17
first_name.trim();
console.log(first_name.length); // 17
let newString = first_name.trim();
console.log(newString); 

console.log(newString.length); // 9
console.log(first_name.length); // 17
first_name = first_name.trim();
console.log(newString); 

console.log(newString.length); // 9
console.log(first_name.length); // 9

