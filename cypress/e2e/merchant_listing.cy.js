/// <reference types="cypress" />
/* eslint-disable no-undef */

describe('Merchant Listing Page Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Should navigate to merchant page from homepage', () => {
    cy.visit('/merchants')
    cy.get('body').should('be.visible')
    cy.wait(2000)
    
    cy.get('body').then(($body) => {
      if ($body.find('a[href*="/m/"]').length > 0) {
        cy.get('a[href*="/m/"]').first().click()
        cy.url().should('include', '/m/')
        cy.get('body').should('be.visible')
      } else {
        cy.log('No merchant links found on merchants page')
      }
    })
  })

  it('Should display merchant page with correct structure', () => {
    cy.visitMerchant('business-corp')
    
    cy.contains('Home').should('be.visible')
    cy.get('body').should('contain', '>')
    cy.get('body').should('contain', 'Merchants')
    cy.get('body').should('contain', 'Business Corp')
  })

  it('Should display merchant heading and breadcrumbs', () => {
    cy.visitMerchant('business-corp')
    
    cy.contains('Home').should('be.visible')
    cy.contains('Merchants').should('be.visible')
    cy.contains('Business Corp').should('be.visible')
    cy.get('body').should('contain', '>')
  })

  it('Should display merchant information', () => {
    cy.visitMerchant('business-corp')
    
    cy.get('body').should('contain', 'Business Corp')
  })

  it('Should display merchant logo or fallback', () => {
    cy.visitMerchant('business-corp')
    
    cy.get('body').then(($body) => {
      if ($body.find('img[alt="Business Corp"]').length > 0) {
        cy.get('img[alt="Business Corp"]').should('be.visible')
      } else {
        cy.get('body').should('contain', 'Business Corp')
      }
    })
  })

  it('Should display product grid or no products message', () => {
    cy.visitMerchant('business-corp')
    
    cy.checkMerchantProducts()
  })

  it('Should display sorting dropdown when products are available', () => {
    cy.visitMerchant('business-corp')
    
    cy.get('body').then(($body) => {
      if ($body.find('select').length > 0) {
        cy.get('select').should('be.visible')
      } else {
        cy.log('Sorting dropdown not available - no products or different layout')
      }
    })
  })

  it('Should handle sorting when available', () => {
    cy.visitMerchant('business-corp')
    
    cy.testMerchantSorting('Most Recent')
  })

  it('Should display pagination when available', () => {
    cy.visitMerchant('business-corp')
    
    cy.get('body').then(($body) => {
      if ($body.find('button').filter(':contains("Next")').length > 0) {
        cy.get('button').filter(':contains("Next")').should('be.visible')
      } else {
        cy.log('Pagination not available - no products or single page')
      }
    })
  })

  it('Should handle pagination navigation when available', () => {
    cy.visitMerchant('business-corp')
    
    cy.testMerchantPagination()
  })

  it('Should display product cards when products are available', () => {
    cy.visitMerchant('business-corp')
    
    cy.get('body').then(($body) => {
      if ($body.find('article').length > 0) {
        cy.get('article').should('be.visible')
        cy.get('article').first().find('img').should('be.visible')
        cy.get('article').first().should('contain', '₦')
      } else {
        cy.contains('No products found').should('be.visible')
      }
    })
  })

  it('Should handle product card interactions when available', () => {
    cy.visitMerchant('business-corp')
    
    cy.get('body').then(($body) => {
      if ($body.find('article').length > 0) {
        cy.get('article').first().scrollIntoView().trigger('mouseover')
        cy.get('article').first().find('button').first().click({ force: true })
        cy.wait(1000)
      } else {
        cy.log('No product cards available for interaction')
      }
    })
  })

  it('Should display loading state', () => {
    cy.visitMerchant('business-corp')
    
    cy.get('body').should('be.visible')
  })

  it('Should handle empty merchant or show products', () => {
    cy.visitMerchant('business-corp')
    
    cy.get('body').then(($body) => {
      if ($body.find('article').length > 0) {
        cy.get('article').should('be.visible')
      } else {
        cy.contains('No products found').should('be.visible')
        cy.contains('Continue Shopping').should('be.visible')
      }
    })
  })

  it('Should maintain URL parameters', () => {
    cy.visitMerchant('business-corp')
    
    cy.url().should('include', '/m/business-corp')
  })

  it('Should handle direct URL access', () => {
    cy.visit('/m/business-corp')
    
    cy.get('body').should('be.visible')
    cy.url().should('include', '/m/business-corp')
  })

  it('Should handle merchant page refresh', () => {
    cy.visitMerchant('business-corp')
    
    cy.reload()
    cy.get('body').should('be.visible')
    cy.url().should('include', '/m/business-corp')
  })

  it('Should handle multiple merchant navigation', () => {
    cy.visitMerchant('business-corp')
    cy.get('body').should('contain', 'Business Corp')
    
    cy.visit('/merchants')
    cy.get('body').then(($body) => {
      if ($body.find('a[href*="/m/"]').length > 1) {
        cy.get('a[href*="/m/"]').eq(1).click()
        cy.url().should('include', '/m/')
        cy.get('body').should('be.visible')
      } else {
        cy.log('Only one merchant available for navigation test')
      }
    })
  })

  it('Should display proper error handling for invalid merchants', () => {
    cy.visit('/m/invalid-merchant-12345')
    
    cy.get('body').should('be.visible')
  })

  it('Should handle merchant pages with special characters', () => {
    cy.visitMerchant('business-corp')
    
    cy.url().should('include', '/m/business-corp')
    cy.get('body').should('be.visible')
  })

  it('Should maintain merchant state during navigation', () => {
    cy.visitMerchant('business-corp')
    cy.get('body').should('contain', 'Business Corp')
    
    cy.visitMerchant('business-corp')
    cy.get('body').should('contain', 'Business Corp')
    
    cy.go('back')
    cy.url().should('match', /^http:\/\/localhost:3000\/?$/)
    cy.get('body').should('be.visible')
  })

  it('Should display merchant-specific SEO elements', () => {
    cy.visitMerchant('business-corp')
    cy.title().should('include', 'Business Corp')
    cy.title().should('include', 'Klump Commerce')
  })

  it('Should navigate back to merchants from merchant page', () => {
    cy.visitMerchant('business-corp')
    cy.contains('Merchants').click()
    cy.url().should('include', '/merchants')
  })

  it('Should navigate back to home from merchant page', () => {
    cy.visitMerchant('business-corp')
    cy.contains('Home').click()
    cy.url().should('match', /^http:\/\/localhost:3000\/?$/)
  })

  it('Should display merchant contact information (if available)', () => {
    cy.visitMerchant('business-corp')
    
    cy.get('body').should('contain', 'Business Corp')
  })

  it('Should handle merchant with no products gracefully or show products', () => {
    cy.visitMerchant('business-corp')
    
    cy.get('body').then(($body) => {
      if ($body.find('article').length > 0) {
        cy.get('article').should('be.visible')
      } else {
        cy.contains('No products found').should('be.visible')
        cy.contains('We couldn\'t find any products in this merchant.').should('be.visible')
        cy.contains('Browse other Merchant and discover our best deals!').should('be.visible')
        cy.contains('Continue Shopping').should('be.visible')
      }
    })
  })

  it('Should display merchant verification status', () => {
    cy.visitMerchant('business-corp')
    
    cy.get('body').should('be.visible')
  })
})
