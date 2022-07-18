describe('Change your username', () => {
  it('Should navigate the Main menue to add a new Admin', () => {
    cy.visit("localhost:4200")
    cy.login("@cypress.test", "CypressTest");

    cy.get("button[title='Options']").click();
    cy.get('button[title="Change Username"]').click();
    cy.get('input[name="nameInput"]').type("Cypress New Username");
    cy.get('.change').click();
    cy.get('button').contains('Change').click()

    cy.wait(2000);

    cy.get("button[title='Options']").click();
    cy.get('button[title="Change Username"]').click();
    cy.get('input[name="nameInput"]').clear().type("Cypress Test");
    cy.get('.change').click();
    cy.get('button').contains('Change').click()

    cy.wait(2000);
  });
});
