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
});

Cypress.Commands.add('createNewQuestion', (title:string, type:string, customAnswers?:string[]) => {
  cy.get('input[name="questionTitleInput"]').type(title);
  cy.get('textarea[name="questionDescriptionInput"]').type('Created in Cypress');

  switch(type) {
    default: throw new Error("Question Type is invalid")
    case "individualAnswer": cy.get('mat-radio-button[value="3"]').click(); break;
    case "yesNoAnswer": cy.get('mat-radio-button[value="1"]').click(); break;
    case "fixedAnswers":
      cy.get('mat-radio-button[value="2"]').click();
      customAnswers.forEach( answer => {
        cy.get('input[name="customAnswerInput"]').type(answer).type('{enter}');
      });
    break;
  }
});

Cypress.Commands.add('addEmails', (emails:string[]) => {
  emails.forEach(email => {
    cy.get('input[name="emailInput"]').type(email).type('{enter}');
  })
});

Cypress.Commands.add('createTempAdmin', () => {
  cy.visit('localhost:4200')
  cy.login('@cypress.test', 'CypressTest');

  cy.get("button[title='Options']").click();
  cy.get("button[title='Add Surveyleader']").click();
  cy.get('mat-checkbox').click();
  cy.get('input[matTooltip="Email of new Surveyleader"]').type("testmail@does.not.exist.com");
  cy.get('input[matTooltip="min. 8 Characters"]').type("testPassword4Cy:");
  cy.get('input[matTooltip="Username of new Surveyleader"]').type("Cypress Test Leader");
  cy.get('.add').click();

  cy.wait(1500);

});

/* FOR DEBUGGING
 .then($button => {
    $button.css('border', '1px solid magenta')
  })
cy.screenshot('press this button')
*/

