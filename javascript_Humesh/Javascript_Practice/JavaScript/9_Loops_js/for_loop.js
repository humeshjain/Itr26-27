for(let j=0;j<=9;j++){
    if(j==5){
        break; // breaks loop at 5th
    }
    console.log(j);
}


for(let j=0;j<=9;j++){
    if(j==5){
        continue; // takes back to loop skips 5th 
    }
    console.log(j);
}