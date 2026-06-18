// How to iterate in Objects
const person = {
    name : "Yatin",
    age : 23,
    "person hobbie" : ["chess","games","sketches"]
}

for(let key in person){
    console.log(key," : " ,person[key]);
}

for(let key in person){
    console.log(`${key} : ${person[key]}`);
}
console.log(Object.keys(person));
// Gives Array of Keys
console.log(Object.values(person));
console.log(typeof Object.values(person));
const val = Array.isArray( Object.values(person));
console.log(val);

for(let key of Object.keys(person)){
    console.log(key);
}


for(let value of Object.values(person)){
    console.log(value);
}