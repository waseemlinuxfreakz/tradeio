describe('Signal Flow', () => {
  beforeEach(() => {
    cy.visit('/');
    // Login first
    cy.get('input[type="email"]').type('ew5933070@gmail.com');
    cy.get('input[type="password"]').type('Logitech@101');
    cy.get('button[type="submit"]').click();
  });

  it('creates and views a signal', () => {
    // Navigate to create signal page
    cy.get('[data-testid="create-signal-btn"]').click();
    
    // Fill signal details
    cy.get('input[placeholder="Enter price"]').type('45000');
    cy.get('input[placeholder="Take Profit"]').type('48000');
    cy.get('input[placeholder="Stop Loss"]').type('43000');
    cy.get('textarea[placeholder="Add signal description..."]')
      .type('Test signal with strong momentum');
    
    // Submit signal
    cy.get('button').contains('Publish').click();
    
    // Verify signal appears in list
    cy.get('[data-testid="signal-card"]').first().should('contain', '45000');
    
    // Click on signal to view details
    cy.get('[data-testid="signal-card"]').first().click();
    
    // Verify signal details
    cy.get('[data-testid="signal-details"]').should('contain', '45000');
    cy.get('[data-testid="signal-details"]').should('contain', '48000');
    cy.get('[data-testid="signal-details"]').should('contain', '43000');
  });

  it('votes on a signal', () => {
    // Navigate to signals page
    cy.visit('/signals');
    
    // Find first signal and vote up
    cy.get('[data-testid="vote-up-btn"]').first().click();
    
    // Verify vote was recorded
    cy.get('[data-testid="consensus-value"]')
      .should('contain', '%');
    
    // Verify can't vote again
    cy.get('[data-testid="vote-up-btn"]')
      .first()
      .should('be.disabled');
  });

  it('filters signals', () => {
    cy.visit('/signals');
    
    // Open filter modal
    cy.get('[data-testid="filter-btn"]').click();
    
    // Set filter values
    cy.get('[data-testid="min-consensus"]').type('80');
    cy.get('[data-testid="risk-level"]').select('High');
    
    // Apply filters
    cy.get('button').contains('Apply').click();
    
    // Verify filtered results
    cy.get('[data-testid="signal-card"]').should('have.length.gt', 0);
  });
});