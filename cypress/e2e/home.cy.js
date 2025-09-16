/// <reference types="cypress" />
/* eslint-disable no-undef */
import testData from '../fixtures/testData.json'

describe('Home', () => {
  it('Should load the homepage with header items and navs intact', () => {
    cy.visit(testData.base_url)
    cy.get('.logo').should('be.visible')
    cy.get('.search').should('be.visible')
    cy.get('.setup-store').should('be.visible')
    cy.get('.cart-icon').should('be.visible')
    cy.get('.navlink').its('length').should('be.gt', 0)
    cy.get('.promo-carousel').find('img').its('length').should('eq', 1)
  })

  it('Should display category cards and clicking on each to goto the category listing page', () => {
    cy.visit(testData.base_url)
    cy.get('.section-heading').find('span').first().invoke('text').should('eq', 'Shop our selections')
    cy.get('.section-sub-heading').invoke('text').should('eq', 'Curated collections hand-picked by Klump')
    cy.get('.category-wrapper').find('article').its('length').should('be.gt', 0)
    cy.wait(3000)
    cy.get('.category-wrapper').find('article').first().click()
    cy.wait(3000)
    cy.location('pathname').should('include', '/c/')
  })

  it('Should display merchant logo and clicking on one should go to merchant product listing page', () => {
    cy.visit(testData.base_url)
    cy.get('.merchant-section').find('span').first().invoke('text').should('eq', 'Browse by merchant')
    cy.get('.merchant-section').find('div').find('a').its('length').should('be.gt', 0)
    cy.get('.merchant-section').find('div').find('a').first().click()
    cy.location('pathname').should('include', '/m/')
  })

  it('Should open merchant listing page when click on browse my merchant', () => {
    cy.visit(testData.base_url)
    cy.get('.merchant-section').find('a').first().click()
    cy.location('pathname').should('include', '/merchants')
  })
})
