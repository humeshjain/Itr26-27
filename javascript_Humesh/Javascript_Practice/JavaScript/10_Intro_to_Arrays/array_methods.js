let fruits = ["apple","mango","grapes"];

console.log(typeof fruits);
console.log(Array.isArray(fruits));
fruits.push("banana");
console.log(fruits);
let poppedelement=fruits.pop();
console.log(fruits);
console.log(poppedelement);
fruits.unshift("banana");
fruits.unshift("myfruit");
console.log(fruits);
let shiftedele = fruits.shift();
console.log(fruits);
console.log(shiftedele);