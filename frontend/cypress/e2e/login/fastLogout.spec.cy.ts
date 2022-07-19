describe('Loggin out of the website', ()  =>{
  it("via fast Logout", () => {
    cy.visit("localhost:4200");
    cy.login("@cypress.test", "CypressTest");

    cy.url().should('eq', "http://localhost:4200/main");

    cy.get('.fastlogout').click();
    cy.url().should('eq', "http://localhost:4200/login");
  });
});
