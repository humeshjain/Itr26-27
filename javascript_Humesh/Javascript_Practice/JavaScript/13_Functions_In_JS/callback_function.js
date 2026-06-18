function myfunc2(name){
    
    console.log("inside my function 2.");
    console.log(`my name is ${name}`);

}

function myfunc(callback){
    console.log("hello there code is been executed")
    callback("Yatin");
}
myfunc(myfunc2);
