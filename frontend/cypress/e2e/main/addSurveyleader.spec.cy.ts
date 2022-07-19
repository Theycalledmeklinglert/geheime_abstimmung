describe('Create a new Surveyleader', () => {
  it('Should navigate the Main menue to add a new Admin', () => {
    cy.visit("localhost:4200");
    cy.login("@cypress.test", "CypressTest");

    cy.get("button[title='Options']").click();
    cy.get("button[title='Add Surveyleader']").click();
    cy.get('mat-checkbox').click();
    cy.get('input[matTooltip="Email of new Surveyleader"]').type("testmail@does.not.exist.com");
    cy.get('input[matTooltip="min. 8 Characters"]').type("testPassword4Cy:");
    cy.get('input[matTooltip="Username of new Surveyleader"]').type("Cypress Test Leader");

    cy.get('.add').click();
  });
});

