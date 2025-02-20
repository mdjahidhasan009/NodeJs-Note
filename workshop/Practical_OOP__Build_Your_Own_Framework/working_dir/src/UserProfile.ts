// // We can not determine which type of object if we create an object with object literal means without class or interface
//
// // const p1 = {
// //     name: "john doe"
// // };
// //
// // const p2 = {
// //     name: "john doe2",
// // };
// //
// // const f = (p: { name: string }) => {
// //     console.log(p.name);
// // }
// //
// // console.log('p1', typeof  p1); // output: object
// // console.log('p2', typeof p2); // output: object
// // console.log('f', typeof f); // output: function
//
//
// class UserProfile {
//     name: string;
//     email: string;
//     password: string;
// }
//
// const user = new UserProfile();
// user.name = 'John Doe';
// user.email = 'john.deo@example.com';
// user.password = 'password';
//
// console.log(typeof user); // output: object
// // using instanceof we can determine if the object is an instance of a class
// console.log(user instanceof UserProfile); // output: true
//
//
// const user2 = new UserProfile();
// user2.name = 'John Doe';
// user2.email = 'john.deo@example.com';
// user2.password = 'password';