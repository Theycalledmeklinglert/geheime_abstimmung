// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })


Cypress.Commands.add("login", (username:string, password:string) => {
  cy.get('input[name="username"]').type(username)
  .get('input[name="password"]').type(password)
  .get('input[name="loginButton"]').click()
  .url().should('include','main');
})

Cypress.Commands.add('createNewQuestion', (title:string, type:string, customAnswers?:string[]) => {
let customCommand = cy.get('input[name="questionTitleInput"]').type(title);
              cy.get('textarea[name="questionDescriptionInput"]').type('Created in Cypress');

switch(type) {
default: throw new Error("Question Type is invalid")
case "individualAnswer": customCommand=customCommand.get('mat-radio-button[value="3"]').click(); break;
case "yesNoAnswer": customCommand=customCommand.get('mat-radio-button[value="1"]').click(); break;
case "fixedAnswers":
customCommand=customCommand.get('mat-radio-button[value="2"]').click();
customAnswers.forEach( answer => {
customCommand =  customCommand.get('input[name="customAnswerInput"]')
                              .type(answer)
                              .type('{enter}');
});
break;
}

return customCommand;

});

