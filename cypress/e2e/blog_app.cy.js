describe('Blog app', function() {
  beforeEach(function() {
    cy.visit('http://localhost:3003')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
  })

  describe('Login', function() {
    it('fails with wrong credentials', function() {
      cy.get('#username').type('TestUserA')
      cy.get('#password').type('wrong')
      cy.contains('login').click()

      cy.contains('log in to application')
      cy.get('.notification')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })
})