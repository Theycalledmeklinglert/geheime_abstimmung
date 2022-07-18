describe('Change the password', () => {
  it('Should navigate the Main menue to change the password', () => {
    cy.visit("localhost:4200")
    cy.login("@cypress.test", "CypressTest");

    cy.get("button[title='Options']").click();
    cy.get("button[title='Change Password']").click();
    cy.get('.txt_field').find('input').type("newPassword");
    cy.get('.change').click();
    cy.get('button').contains('Change').click();

    cy.wait(2000);

    cy.get("button[title='Options']").click();
    cy.get("button[title='Change Password']").click();
    cy.get('.txt_field').find('input').clear().type("CypressTest");
    cy.get('.change').click();
    cy.get('button').contains('Change').click()

    cy.wait(2000);

  });
});
