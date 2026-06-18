
const users = [
    {
    userid : 1,
    user_name: "Yatin",
    gender : "male"},
    {
    userid : 2,
    user_name: "siddesh",
    gender : "male"},
    {
    userid : 3,
    user_name: "shivani",
    gender : "female"},

]

const[{user_name : user1_username,userid},,{gender:user3_gender}] = users;
console.log(user1_username);
console.log(user3_gender);
console.log(userid);
