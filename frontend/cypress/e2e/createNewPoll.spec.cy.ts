describe('Create a new Poll', () => {
  it('Should create a new Poll without error', () => {
    cy.visit('/');
    //login
    cy.login('ernst.blofeld@fhws.de', '12345');
    //create a poll
    cy.get('button[id="addNewVote"]').click();
    cy.url().should('include','/editor');


    cy.get('input[name="pollNameInput"]').type('Cypress CreatePoll Test');
    cy.get('input[name="dateInput"]').type('2022-08-01T08:20');

    cy.createNewQuestion( 'Wie ist der Aktuelle Stand des Programmierprojekts?',
                          'fixedAnswers',['Vollständig fertig','Fast vollständig fertig',
                          'nicht einmal ansatzweise fertig']);

  });
})
