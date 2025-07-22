describe('Portfolio Management', () => {
  beforeEach(() => {
    cy.visit('/');
    // Login
    cy.get('input[type="email"]').type('ew5933070@gmail.com');
    cy.get('input[type="password"]').type('Logitech@101');
    cy.get('button[type="submit"]').click();
  });

  it('displays portfolio overview', () => {
    cy.visit('/portfolio');
    
    // Check portfolio stats
    cy.get('[data-testid="total-balance"]').should('exist');
    cy.get('[data-testid="profit-loss"]').should('exist');
    cy.get('[data-testid="active-signals"]').should('exist');
  });

  it('manages active signals', () => {
    cy.visit('/portfolio');
    
    // Open active signal
    cy.get('[data-testid="signal-card"]').first().click();
    
    // Modify take profit
    cy.get('[data-testid="edit-tp-btn"]').click();
    cy.get('input[name="takeProfit"]').clear().type('48000');
    cy.get('button').contains('Save').click();
    
    // Verify changes
    cy.get('[data-testid="take-profit"]').should('contain', '48000');
  });

  it('handles signal execution', () => {
    cy.visit('/signals');
    
    // Find and execute signal
    cy.get('[data-testid="signal-card"]').first().click();
    cy.get('[data-testid="execute-btn"]').click();
    
    // Fill execution form
    cy.get('input[name="amount"]').type('1000');
    cy.get('input[name="leverage"]').type('10');
    cy.get('button').contains('Execute Trade').click();
    
    // Verify execution
    cy.get('[data-testid="execution-success"]').should('exist');
  });

  it('displays transaction history', () => {
    cy.visit('/portfolio');
    
    // Open transaction history
    cy.get('[data-testid="transactions-tab"]').click();
    
    // Verify transactions
    cy.get('[data-testid="transaction-item"]').should('have.length.at.least', 1);
    cy.get('[data-testid="transaction-amount"]').first().should('exist');
    cy.get('[data-testid="transaction-date"]').first().should('exist');
  });
});