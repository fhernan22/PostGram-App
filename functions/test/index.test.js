// const request = require("supertest");

// describe("Cloud Functions", () => {
//   let myFunctions;

//   before(() => {
//     myFunctions = require("../index");
//   });

//   describe("GET /helloworld", () => {
//     it("It should return Hello World! May the force be with you!", (done) => {
//       request(myFunctions.api)
//         .post("/login")
//         .expect("Hello World! May the force be with you!")
//         .expect(200)
//         .send({ email: "test@email.com", password: "Helloworld1" })
//         .end((err, res) => {
//           if (err) return done(err);

//           return done();
//         });
//     });
//   });
// });
