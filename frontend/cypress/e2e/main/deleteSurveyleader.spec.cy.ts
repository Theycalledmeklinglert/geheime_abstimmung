describe('Deletes a Surveyleader', () => {
  it('Should navigate the Main menue to delete a Srurvey Leader', (input) => {
      cy.visit("localhost:4200")
      cy.login("@michael", "12345678");

      cy.get("button[title='Options']").click();
      cy.get("button[title='Delete Surveyleader']").click();
      cy.get('div').should('have.text', 'testmail@does.not.exist.com').click();

      //cy.get('button[name='addleader]').click();

  });
});
