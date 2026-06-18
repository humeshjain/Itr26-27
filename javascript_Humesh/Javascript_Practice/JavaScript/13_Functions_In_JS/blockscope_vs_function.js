function myApp(){
    if(true){
        let firstname = "yatin"; // case 1: block scoped
        console.log(firstname); // accessed 
    }
    console.log(firstname);
}

myApp();