describe('Settings Management', () => {
  beforeEach(() => {
    cy.visit('/');
    // Login
    cy.get('input[type="email"]').type('ew5933070@gmail.com');
    cy.get('input[type="password"]').type('Logitech@101');
    cy.get('button[type="submit"]').click();
  });

  it('updates profile settings', () => {
    cy.visit('/settings');
    
    // Update profile info
    cy.get('input[name="displayName"]').clear().type('NewTrader123');
    cy.get('textarea[name="bio"]').clear().type('Experienced crypto trader');
    cy.get('button').contains('Save Changes').click();
    
    // Verify changes
    cy.get('[data-testid="success-message"]').should('exist');
    cy.reload();
    cy.get('input[name="displayName"]').should('have.value', 'NewTrader123');
  });

  it('configures notification preferences', () => {
    cy.visit('/settings');
    
    // Navigate to notifications
    cy.get('[data-testid="notifications-tab"]').click();
    
    // Toggle settings
    cy.get('[data-testid="signal-notifications"]').click();
    cy.get('[data-testid="community-notifications"]').click();
    
    // Save preferences
    cy.get('button').contains('Save Preferences').click();
    
    // Verify changes persisted
    cy.reload();
    cy.get('[data-testid="signal-notifications"]').should('be.checked');
    cy.get('[data-testid="community-notifications"]').should('be.checked');
  });

  it('manages trading preferences', () => {
    cy.visit('/settings');
    
    // Navigate to trading settings
    cy.get('[data-testid="trading-tab"]').click();
    
    // Update preferences
    cy.get('select[name="defaultLeverage"]').select('10');
    cy.get('input[name="maxRiskPerTrade"]').clear().type('5');
    
    // Save changes
    cy.get('button').contains('Save Trading Settings').click();
    
    // Verify changes
    cy.get('[data-testid="success-message"]').should('exist');
  });

  it('handles wallet connections', () => {
    cy.visit('/settings');
    
    // Navigate to wallet settings
    cy.get('[data-testid="wallet-tab"]').click();
    
    // Connect wallet
    cy.get('[data-testid="connect-wallet-btn"]').click();
    
    // Verify connection modal
    cy.get('[data-testid="wallet-modal"]').should('be.visible');
    cy.get('[data-testid="telegram-wallet-option"]').should('exist');
  });
});