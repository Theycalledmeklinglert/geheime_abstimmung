describe('Loggin out of the website', ()  =>{
  it("via menu option", () => {
    cy.visit("localhost:4200");
    cy.login("@cypress.test", "CypressTest");

    cy.url().should('eq', "http://localhost:4200/main")

    cy.get("button[title='Options']").click();
    cy.get('button[title="Logout"]').click();

    cy.url().should('eq', "http://localhost:4200/login");
  });
});
