describe('Login Test', () => {
  it('Should not login if the form is invalid', () => {
    cy.visit('/')
    cy.get('input[name="username"]').type('ernst.blofeld@fhws.de')
    cy.get('input[name="password"]').type('12345')
    cy.get('input[name="loginButton"]').click();
    cy.url().should('include','main')
  })
})
