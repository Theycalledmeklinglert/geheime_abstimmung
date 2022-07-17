describe('Create a new Poll', () => {
  it('Should create a new Poll without error', () => {
    cy.visit('/');
    //login
    cy.login('@michael', '12345678');

    //create a poll
    cy.get('button[id="addNewVote"]').click();
    cy.url().should('include','/editor');
    cy.get('input[name="pollNameInput"]').type('Cypress CreatePoll Test');
    cy.get('input[name="dateInput"]').type('2022-08-01T08:20');

    //add Questions
    cy.createNewQuestion( 'Wie ist der Aktuelle Stand des Programmierprojekts?',
                          'fixedAnswers',
                          ['Vollständig fertig','Fast vollständig fertig','nicht einmal ansatzweise fertig']);

    cy.get('button[id="addQuestion"]').click();
    cy.createNewQuestion( 'Schafft ihr es das Projekt bis zum Abgabetermin zu finalisieren?',
                          'yesNoAnswer');

    cy.get('button[id="addQuestion"]').click();
    cy.createNewQuestion( 'Was fehlt noch?',
                          'individualAnswer');


    cy.get('button[name="nextToEmails"]').click();
    cy.addEmails(["mail1@test.com", "mail2@test.com", "mail3@test.com", "mail4@test.com"]);

    cy.get('button[name="trySubmitPoll"]').click();
    //cy.get('button[name="submitPoll"]').click();


  });
})
