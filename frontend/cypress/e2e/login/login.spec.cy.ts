describe('Login Test', () => {
  it('Should not login if the form is invalid', () => {
    cy.visit('/')
    cy.get('input[name="username"]').type('@cypress.test')
    cy.get('input[name="password"]').type('CypressTest')
    cy.get('input[name="loginButton"]').click();
    cy.url().should('include','main')
  })
})
