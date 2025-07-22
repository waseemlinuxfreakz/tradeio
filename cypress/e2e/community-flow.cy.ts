describe('Community Features', () => {
  beforeEach(() => {
    cy.visit('/');
    // Login
    cy.get('input[type="email"]').type('ew5933070@gmail.com');
    cy.get('input[type="password"]').type('Logitech@101');
    cy.get('button[type="submit"]').click();
  });

  it('follows and unfollows analysts', () => {
    cy.visit('/community');
    
    // Follow analyst
    cy.get('[data-testid="analyst-card"]').first()
      .find('[data-testid="follow-btn"]')
      .click();
    
    // Verify following
    cy.get('[data-testid="following-badge"]').should('exist');
    
    // Unfollow
    cy.get('[data-testid="follow-btn"]').click();
    cy.get('[data-testid="following-badge"]').should('not.exist');
  });

  it('participates in discussions', () => {
    cy.visit('/community');
    
    // Open discussion
    cy.get('[data-testid="discussion-thread"]').first().click();
    
    // Add comment
    cy.get('[data-testid="comment-input"]')
      .type('Great analysis!');
    cy.get('[data-testid="submit-comment"]').click();
    
    // Verify comment posted
    cy.get('[data-testid="comment-list"]')
      .should('contain', 'Great analysis!');
  });

  it('shares signals', () => {
    cy.visit('/signals');
    
    // Share signal
    cy.get('[data-testid="signal-card"]').first()
      .find('[data-testid="share-btn"]')
      .click();
    
    // Verify share options
    cy.get('[data-testid="share-modal"]').should('be.visible');
    cy.get('[data-testid="telegram-share"]').should('exist');
    cy.get('[data-testid="twitter-share"]').should('exist');
  });

  it('views leaderboard', () => {
    cy.visit('/leaderboard');
    
    // Check leaderboard elements
    cy.get('[data-testid="leaderboard-table"]').should('exist');
    cy.get('[data-testid="rank-column"]').should('exist');
    cy.get('[data-testid="analyst-column"]').should('exist');
    cy.get('[data-testid="success-rate-column"]').should('exist');
  });
});