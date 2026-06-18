const person = {
    name : "Yatin",
    age : 23,
    hobbie : ["chess","games","sketches"]
}

console.log(typeof person);

console.log(person.name);
console.log(person.age);
console.log(person);
console.log(person.hobbie);
console.log(person["name"]);
console.log(person["age"]);
console.log(person["hobbie"]);
person.gender = "male";
console.log(person);

person["city"]="kalyan";
console.log(person);
