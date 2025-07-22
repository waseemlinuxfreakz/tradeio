describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('successfully logs in', () => {
    cy.get('input[type="email"]').type('ew5933070@gmail.com');
    cy.get('input[type="password"]').type('Logitech@101');
    cy.get('button[type="submit"]').click();
    
    // Verify redirect to dashboard
    cy.url().should('include', '/dashboard');
    
    // Verify user is logged in
    cy.get('[data-testid="user-profile"]').should('exist');
  });

  it('shows error for invalid credentials', () => {
    cy.get('input[type="email"]').type('wrong@email.com');
    cy.get('input[type="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();
    
    // Verify error message
    cy.get('[data-testid="error-message"]')
      .should('contain', 'Invalid credentials');
    
    // Verify still on login page
    cy.url().should('include', '/login');
  });

  it('successfully registers new user', () => {
    cy.visit('/register');
    
    // Fill registration form
    cy.get('input[name="email"]').type('newuser@test.com');
    cy.get('input[name="username"]').type('newuser');
    cy.get('input[name="password"]').type('Test123!');
    
    // Select account type
    cy.get('[data-testid="account-type-regular"]').click();
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Verify redirect to dashboard
    cy.url().should('include', '/dashboard');
  });

  it('logs out successfully', () => {
    // Login first
    cy.get('input[type="email"]').type('ew5933070@gmail.com');
    cy.get('input[type="password"]').type('Logitech@101');
    cy.get('button[type="submit"]').click();
    
    // Click logout button
    cy.get('[data-testid="logout-btn"]').click();
    
    // Verify redirect to login
    cy.url().should('include', '/login');
    
    // Verify protected routes are inaccessible
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
  });
});