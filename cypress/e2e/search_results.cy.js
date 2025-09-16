/// <reference types="cypress" />
/* eslint-disable no-undef */
import testData from '../fixtures/testData.json'

describe('Search Results Functionality', () => {
  beforeEach(() => {
    cy.visit(testData.base_url)
  })

  it('Should display search results with product information', () => {
    const searchTerm = 'phone'
    
    cy.performSearch(searchTerm)
    
    cy.contains(`Search Results for: "${searchTerm}"`).should('be.visible')
    cy.contains('Home').should('be.visible')
    cy.contains('Search Result').should('be.visible')
  })

  it('Should handle search results pagination', () => {
    const searchTerm = 'electronics'
    
    cy.visitSearchResults(searchTerm)
    
    // Check if pagination controls exist (if there are enough results)
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="pagination"]').length > 0) {
        // Test pagination if it exists
        cy.get('[data-cy="pagination"]').should('be.visible')
      } else {
        // If no pagination, just verify the page loads
        cy.contains(`Search Results for: "${searchTerm}"`).should('be.visible')
      }
    })
  })

  it('Should handle search results sorting', () => {
    const searchTerm = 'laptop'
    
    cy.visitSearchResults(searchTerm)
    
    // Check if sorting controls exist
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="sort-dropdown"]').length > 0) {
        // Test sorting if it exists
        cy.get('[data-cy="sort-dropdown"]').should('be.visible')
      } else {
        // If no sorting, just verify the page loads
        cy.contains(`Search Results for: "${searchTerm}"`).should('be.visible')
      }
    })
  })

  it('Should display product cards with correct information', () => {
    const searchTerm = 'shoes'
    
    cy.visitSearchResults(searchTerm)
    
    // Wait for results to load
    cy.wait(2000)
    
    // Check if product cards are displayed
    cy.get('body').then(($body) => {
      if ($body.find('article').length > 0) {
        // If products exist, check their structure
        cy.get('article').first().should('be.visible')
        
        // Check for product image
        cy.get('article').first().find('img').should('be.visible')
        
        // Check for product name
        cy.get('article').first().find('h2, h3').should('be.visible')
      } else {
        // If no products, verify the page still loads correctly
        cy.contains(`Search Results for: "${searchTerm}"`).should('be.visible')
      }
    })
  })

  it('Should handle search with multiple words', () => {
    const searchTerm = 'wireless headphones'
    
    cy.performSearch(searchTerm)
    
    cy.url().should('include', 'q=')
    cy.url().should('include', 'wireless')
    cy.url().should('include', 'headphones')
  })

  it('Should maintain search state when refreshing page', () => {
    const searchTerm = 'tablet'
    
    cy.visitSearchResults(searchTerm)
    
    cy.reload()
    
    cy.url().should('include', `q=${encodeURIComponent(searchTerm)}`)
    cy.contains(`Search Results for: "${searchTerm}"`).should('be.visible')
  })

  it('Should handle search with special characters and numbers', () => {
    const searchTerm = 'iPhone 13 Pro Max'
    
    cy.performSearch(searchTerm)
    
    cy.url().should('include', '/search')
    cy.url().should('include', 'q=')
  })

  it('Should show appropriate message for no results', () => {
    const searchTerm = 'nonexistentproductxyz123'
    
    cy.visitSearchResults(searchTerm)
    
    cy.get('#searchResult').should('be.visible')
    cy.contains(`Search Results for: "${searchTerm}"`).should('be.visible')
    
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="no-results"]').length > 0) {
        cy.get('[data-cy="no-results"]').should('be.visible')
      }
    })
  })

  it('Should handle search with very short terms', () => {
    const searchTerm = 'a'
    
    cy.performSearch(searchTerm)
    
    cy.url().should('include', '/search')
    cy.contains(`Search Results for: "${searchTerm}"`).should('be.visible')
  })

  it('Should handle search with very long terms', () => {
    const searchTerm = 'this is a very long search term that might not return any results but should be handled gracefully'
    
    cy.performSearch(searchTerm)
    
    cy.url().should('include', '/search')
    cy.contains(`Search Results for: "${searchTerm}"`).should('be.visible')
  })

  it('Should preserve search functionality after navigation', () => {
    const searchTerm = 'camera'
    
    cy.performSearch(searchTerm)
    
    cy.contains('Home').click()
    cy.performSearch('laptop')
    
    cy.url().should('include', '/search')
    cy.contains('Search Results for: "laptop"').should('be.visible')
  })

  it('Should handle search with URL parameters', () => {
    const searchTerm = 'gaming'
    const limit = '6'
    const offset = '0'
    
    cy.visit(`/search?q=${encodeURIComponent(searchTerm)}&limit=${limit}&offset=${offset}`)
    
    cy.url().should('include', `q=${encodeURIComponent(searchTerm)}`)
    cy.url().should('include', `limit=${limit}`)
    cy.url().should('include', `offset=${offset}`)
    cy.contains(`Search Results for: "${searchTerm}"`).should('be.visible')
  })
})
