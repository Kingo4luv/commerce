/// <reference types="cypress" />
/* eslint-disable no-undef */

describe('Product Details', () => {
  it('Should a product details page when a product card is clicked', () => {
    cy.navigateToProduct()
  })

  it('Should display product preview image and gallery, add to cart button and a quantity button', () => {
    cy.navigateToProduct()
    cy.get('.preview-image').should('be.visible')
    cy.get('.image-gallery').find('img').its('length').should('be.gt', 0)
    cy.get('#quantityBtn').should('be.visible')
    cy.get('#cartToCartWrapper').find('button').first().should('be.visible')
  })

  it('Should change the current image when gallery image is hovered', () => {
    cy.navigateToProduct()
    cy.wait(3000)
    cy.get('.image-gallery').find('img').last().click()
    cy.wait(5000)
    cy.get('.image-gallery')
      .find('img')
      .last()
      .invoke('attr', 'src')
      .then(ref => {
        cy.wait(5000)
        cy.get('.preview-image').find('img').should('have.attr', 'src', ref)
      })
  })

  it('Quantity button should increment and decrement when changed', () => {
    cy.navigateToProduct()
    cy.wait(3000)
    cy.increaseQuantity(1)
    cy.get('#quantityBtn').find('p').invoke('text').should('be.eq', '2')
    cy.decreaseQuantity(1)
    cy.get('#quantityBtn').find('p').invoke('text').should('be.eq', '1')
  })

  it('Clicking on the add to cart button should add one item to cart', () => {
    cy.navigateToProduct()
    cy.addProductToCart()
    cy.clearCart()
  })
})
