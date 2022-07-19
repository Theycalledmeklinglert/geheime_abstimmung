describe('Deletes a Surveyleader', () => {
  it('Should navigate the Main menue to delete a Srurvey Leader', () => {
    cy.createTempAdmin();
    cy.wait(1000); //wait for setting admins privilege in dev mode
    
    cy.get("button[title='Options']").click();
    cy.get("button[title='Delete Surveyleader']").click();
    cy.get('ul[name="userlist"]').scrollTo(0, 500)
    cy.get('.user').contains('testmail@does.not.exist.com').parent().find('#delete').click()
    cy.get('.delete_btn').click()
  });
});
