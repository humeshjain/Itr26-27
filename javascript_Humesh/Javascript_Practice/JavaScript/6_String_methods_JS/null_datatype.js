

let myvar = null;
console.log(myvar); // null
console.log(typeof myvar,myvar); // object , null

myvar = "uadasfa";
console.log(typeof myvar,myvar); // string, null

let mynull = null;
console.log(typeof mynull); // object 

let mynum = 123;

console.log(mynum);
console.log(Number.MAX_SAFE_INTEGER);

let num = BigInt(315);
let num1 = 123n;
console.log(num);
console.log(num + num1);
let num3 = 1245;
console.log(num + num3);//  invalid
