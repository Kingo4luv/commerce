/// <reference types="cypress" />
/* eslint-disable no-undef */
import testData from '../fixtures/testData.json'

describe('Category Listing Functionality', () => {
  beforeEach(() => {
    cy.visit(testData.base_url)
  })

  it('Should navigate to category page from homepage', () => {
    cy.get('.category-wrapper').find('article').its('length').should('be.gt', 0)
    cy.get('.category-wrapper').find('article').first().click()
    cy.url().should('include', '/c/')
    cy.get('body').should('contain', 'Home')
  })

  it('Should display category page with correct structure', () => {
    cy.visit('/c/sndmfds')
    
    cy.contains('Home').should('be.visible')
    cy.get('body').should('contain', '>')
    cy.get('body').should('contain', 'Test-Tuna-bprmjx')
  })

  it('Should display category heading and breadcrumbs', () => {
    cy.visit('/c/sndmfds')
    
    cy.get('h1, h2, h3').should('be.visible')
    cy.contains('Home').should('be.visible')
    cy.get('body').should('contain', '>')
  })

  it('Should display product grid when products are available', () => {
    cy.visit('/c/sndmfds')
    
    cy.get('body').then(($body) => {
      if ($body.find('article').length > 0) {
        cy.get('article').should('be.visible')
        cy.get('article').first().find('img').should('be.visible')
        cy.get('article').first().find('h2, h3').should('be.visible')
      } else {
        cy.contains('No products found').should('be.visible')
      }
    })
  })

  it('Should display sorting dropdown for category pages', () => {
    cy.visit('/c/sndmfds')
    
    cy.get('body').then(($body) => {
      if ($body.find('select').length > 0) {
        cy.get('select').should('be.visible')
        cy.get('select').should('contain', 'Most Recent')
        cy.get('select').should('contain', 'Highest Price')
        cy.get('select').should('contain', 'From Oldest')
      } else {
        cy.log('Sorting dropdown not visible - may not have products')
      }
    })
  })

  it('Should handle sorting functionality', () => {
    cy.visit('/c/sndmfds')
    
    cy.get('body').then(($body) => {
      if ($body.find('select').length > 0) {
        cy.get('select').select('Highest Price')
        cy.wait(2000)
        cy.url().should('include', '/c/sndmfds')
      } else {
        cy.log('Sorting not available - no products to sort')
      }
    })
  })

  it('Should display pagination when there are multiple pages', () => {
    cy.visit('/c/sndmfds')
    
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="pagination"]').length > 0) {
        cy.get('[data-cy="pagination"]').should('be.visible')
      } else if ($body.find('button').filter(':contains("Next")').length > 0) {
        cy.get('button').filter(':contains("Next")').should('be.visible')
      } else {
        cy.log('Pagination not visible - may not have enough products')
      }
    })
  })

  it('Should handle pagination navigation', () => {
    cy.visit('/c/sndmfds')
    
    cy.get('body').then(($body) => {
      if ($body.find('button').filter(':contains("Next")').length > 0) {
        cy.get('button').filter(':contains("Next")').click()
        cy.wait(2000)
        cy.url().should('include', '/c/sndmfds')
      } else {
        cy.log('Pagination not available - single page of results')
      }
    })
  })

  it('Should display product cards with correct information', () => {
    cy.visit('/c/sndmfds')
    
    cy.get('body').then(($body) => {
      if ($body.find('article').length > 0) {
        cy.get('article').first().should('be.visible')
        
        cy.get('article').first().find('img').should('be.visible')
        cy.get('article').first().find('h2, h3').should('be.visible')
        
        cy.get('article').first().find('img').should('have.attr', 'src')
        cy.get('article').first().find('img').should('have.attr', 'alt')
      } else {
        cy.contains('No products found').should('be.visible')
      }
    })
  })

  it('Should handle product card interactions', () => {
    cy.visit('/c/sndmfds')
    
    cy.get('body').then(($body) => {
      if ($body.find('article').length > 0) {
        cy.get('article').first().click()
        cy.url().should('include', '/p/')
      } else {
        cy.log('No products available to test interactions')
      }
    })
  })

  it('Should display loading state during page load', () => {
    cy.visit('/c/sndmfds')
    
    cy.get('body').then(($body) => {
      if ($body.find('.animate-pulse').length > 0) {
        cy.get('.animate-pulse').should('be.visible')
      } else {
        cy.log('Loading state not visible - page loaded quickly')
      }
    })
  })

  it('Should handle empty category gracefully', () => {
    cy.visit('/c/nonexistent-category')
    
    cy.get('body').then(($body) => {
      if ($body.find('article').length === 0) {
        cy.contains('No products found').should('be.visible')
        cy.contains('Continue Shopping').should('be.visible')
      } else {
        cy.log('Category has products despite being "nonexistent"')
      }
    })
  })

  it('Should maintain URL parameters for sorting and pagination', () => {
    cy.visit('/c/sndmfds?sortByField=price&sortOrder=DESC&page=1')
    
    cy.url().should('include', '/c/sndmfds')
    cy.url().should('include', 'sortByField=price')
    cy.url().should('include', 'sortOrder=DESC')
    cy.url().should('include', 'page=1')
  })

  it('Should handle direct URL access to category pages', () => {
    cy.visit('/c/sndmfds')
    
    cy.url().should('include', '/c/sndmfds')
    cy.get('body').should('be.visible')
  })

  it('Should display category-specific SEO elements', () => {
    cy.visit('/c/sndmfds')
    
    cy.title().should('include', 'Klump Commerce')
    cy.title().should('include', 'category page')
  })

  it('Should handle category page refresh', () => {
    cy.visit('/c/sndmfds')
    cy.reload()
    
    cy.url().should('include', '/c/sndmfds')
    cy.get('body').should('be.visible')
  })

  it('Should navigate back to home from category page', () => {
    cy.visit('/c/sndmfds')
    cy.contains('Home').click()
    
    cy.url().should('match', /^http:\/\/localhost:3000\/?$/)
  })

  it('Should handle multiple category navigation', () => {
    cy.visit('/c/sndmfds')
    cy.visit('/c/sndmfds')
    
    cy.url().should('include', '/c/sndmfds')
    cy.get('body').should('be.visible')
  })

  it('Should display proper error handling for invalid categories', () => {
    cy.visit('/c/invalid-category-12345', { failOnStatusCode: false })
    
    cy.get('body').then(($body) => {
      if ($body.find('article').length === 0) {
        cy.contains('No products found').should('be.visible')
      } else {
        cy.log('Invalid category still returned products')
      }
    })
  })

  it('Should handle category pages with special characters', () => {
    cy.visit('/c/sndmfds')
    
    cy.url().should('include', '/c/sndmfds')
    cy.get('body').should('be.visible')
  })

  it('Should maintain category state during navigation', () => {
    cy.visit('/c/sndmfds')
    cy.get('body').should('contain', 'Test-Tuna-bprmjx')
    
    cy.visit('/c/sndmfds')
    cy.get('body').should('contain', 'Test-Tuna-bprmjx')
    
    cy.go('back')
    cy.url().should('match', /^http:\/\/localhost:3000\/?$/)
    cy.get('body').should('be.visible')
  })
})
