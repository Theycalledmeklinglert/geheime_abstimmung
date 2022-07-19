describe('Loggin in to the website', ()  =>{
  it("but use wrong password", () => {
    //reset the timer
    cy.visit("localhost:4200");
    cy.login('testmail@does.not.exist.com', 'testPassword4Cy:');
    cy.get('.fastlogout').click();

    cy.get('input[name="username"]').type('testmail@does.not.exist.com');
    cy.get('input[name="password"]').type('WrongPassord');
    cy.get('input[name="loginButton"]').click();
    cy.url().should('eq', 'http://localhost:4200/login');

    for(let i = 0; i<5; i++) {
      cy.wait(1000);
      cy.get('input[type="submit"]').click();
      cy.url().should('eq', 'http://localhost:4200/login');
    }

    cy.get('.loginFailed').should('contain.text', 'Timeout for');
  });
});
