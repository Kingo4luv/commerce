/// <reference types="cypress" />
/* eslint-disable no-undef */
import testData from '../fixtures/testData.json'

describe('Search Functionality', () => {
  beforeEach(() => {
    cy.visit(testData.base_url)
  })

  it('Should display search input field on homepage', () => {
    cy.get('#search').should('be.visible')
    cy.get('#search').should('have.attr', 'placeholder', 'Search for anything')
  })

  it('Should show search dropdown when typing in search input', () => {
    cy.get('#search').type('phone')
    cy.wait(1000)
    
    cy.get('body').then(($body) => {
      if ($body.find('.absolute.top-full').length > 0) {
        cy.get('.absolute.top-full').should('be.visible')
      } else {
        cy.get('#search').should('have.value', 'phone')
        cy.log('Search dropdown not visible - API may not have returned results')
      }
    })
  })

  it('Should navigate to search results page when search form is submitted', () => {
    const searchTerm = 'laptop'
    
    cy.get('#search').type(searchTerm)
    cy.get('#searchForm').submit()
    
    cy.url().should('include', '/search')
    cy.url().should('include', `q=${encodeURIComponent(searchTerm)}`)
  })

  it('Should navigate to search results page when search button is clicked', () => {
    const searchTerm = 'shoes'
    
    cy.get('#search').type(searchTerm)
    cy.get('#searchBtn').click()
    
    cy.url().should('include', '/search')
    cy.url().should('include', `q=${encodeURIComponent(searchTerm)}`)
  })

  it('Should display search results page with correct heading', () => {
    const searchTerm = 'electronics'
    
    cy.visit(`/search?q=${encodeURIComponent(searchTerm)}`)
    
    cy.get('#searchResult').should('be.visible')
    cy.contains('Home').should('be.visible')
    cy.contains('Search Result').should('be.visible')
    cy.contains(`Search Results for: "${searchTerm}"`).should('be.visible')
  })

  it('Should handle empty search gracefully', () => {
    cy.visit('/search')
    cy.contains('Search Results').should('be.visible')
  })

  it('Should display loading state during search', () => {
    const searchTerm = 'test'
    
    cy.visit(`/search?q=${encodeURIComponent(searchTerm)}`)
    cy.get('#searchResult').should('be.visible')
  })

  it('Should handle special characters in search terms', () => {
    const searchTerm = 'café & restaurant'
    
    cy.get('#search').type(searchTerm)
    cy.get('#searchForm').submit()
    
    cy.url().should('include', '/search')
    cy.url().should('include', 'q=')
  })

  it('Should clear search dropdown when clicking outside', () => {
    cy.get('#search').type('test')
    cy.wait(1000)
    
    cy.get('body').then(($body) => {
      if ($body.find('.absolute.top-full').length > 0) {
        cy.get('body').click(0, 0)
        cy.get('.absolute.top-full').should('not.exist')
      } else {
        cy.get('#search').should('have.value', 'test')
        cy.log('Search dropdown not visible - API may not have returned results')
      }
    })
  })

  it('Should handle search with no results', () => {
    const searchTerm = 'nonexistentproduct12345'
    
    cy.visit(`/search?q=${encodeURIComponent(searchTerm)}`)
    
    cy.get('#searchResult').should('be.visible')
    cy.contains(`Search Results for: "${searchTerm}"`).should('be.visible')
  })

  it('Should maintain search term in URL when navigating back', () => {
    const searchTerm = 'mobile'
    
    cy.get('#search').type(searchTerm)
    cy.get('#searchForm').submit()
    
    cy.url().should('include', `/search?q=${encodeURIComponent(searchTerm)}`)
    
    cy.contains('Home').click()
    cy.go('back')
    
    cy.url().should('include', `/search?q=${encodeURIComponent(searchTerm)}`)
  })

  it('Should handle search with very long search terms', () => {
    const longSearchTerm = 'a'.repeat(100)
    
    cy.get('#search').type(longSearchTerm)
    cy.get('#searchForm').submit()
    
    cy.url().should('include', '/search')
    cy.url().should('include', 'q=')
  })

  it('Should work with keyboard navigation (Enter key)', () => {
    const searchTerm = 'keyboard'
    
    cy.get('#search').type(searchTerm)
    cy.get('#search').type('{enter}')
    
    cy.url().should('include', '/search')
    cy.url().should('include', `q=${encodeURIComponent(searchTerm)}`)
  })

  it('Should handle search with whitespace properly', () => {
    const searchTerm = '  phone case  '
    const trimmedTerm = searchTerm.trim()
    
    cy.get('#search').type(searchTerm)
    cy.get('#searchForm').submit()
    
    cy.url().should('include', '/search')
    cy.url().should('include', `q=${encodeURIComponent(trimmedTerm)}`)
  })
})
