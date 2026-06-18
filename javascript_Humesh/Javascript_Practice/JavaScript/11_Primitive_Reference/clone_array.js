let array_1=["item1","item2"];
let oneMore=["item3","item4"];
let array_2=[...array_1,...oneMore,"item5"];

array_1.push("item3");
console.log(array_1==array_2);
console.log(array_1);
console.log(array_2);