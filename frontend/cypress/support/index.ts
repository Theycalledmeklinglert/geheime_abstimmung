import './commands'

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      login(username:string, password:string): Chainable<Element>;
      createNewQuestion(title:string, type:string, customAnswers?:string[]): Chainable<Element>;
      addEmails(emails:string[]): Chainable<Element>;
    }
  }
}

export {};
