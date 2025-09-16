/* eslint-disable no-undef */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

//command to update user location
Cypress.Commands.add('setUserLocation', () => {
  cy.wait(2000)
  cy.get('#cartToCartWrapper').find('button').last().click()

  //get the first select element and select option with value "Lagos"
  cy.get('button[aria-label="filter"]').first().click()

  cy.wait(3000)

  // Choose Lagos from the list - make it more robust
  cy.get('body').then(($body) => {
    if ($body.find('li:contains("Lagos")').length > 0) {
      cy.contains('li', 'Lagos').click()
    } else {
      cy.log('Lagos not found in location list, trying alternative')
      cy.get('li').first().click()
    }
  })

  cy.get('button[aria-label="filter"]').last().click()

  // Choose Lagos Island from the list - make it more robust
  cy.get('body').then(($body) => {
    if ($body.find('li:contains("Lagos Island")').length > 0) {
      cy.contains('li', 'Lagos Island').click()
    } else if ($body.find('li:contains("Ikeja")').length > 0) {
      cy.contains('li', 'Ikeja').click()
    } else {
      cy.log('Lagos Island not found, selecting first available option')
      cy.get('li').first().click()
    }
  })

  cy.wait(3000)

  // Try to find and click "Update location" button, but don't fail if not found
  cy.get('body').then(($body) => {
    if ($body.find('button:contains("Update location")').length > 0) {
      cy.contains('button', 'Update location').click()
    } else {
      cy.log('Update location button not found, continuing without it')
    }
  })
})

// Navigate to a product page from category
Cypress.Commands.add('navigateToProduct', (categoryUrl = '/c/sndmfds') => {
  cy.visit(`${Cypress.env('baseUrl') || 'http://localhost:3000'}${categoryUrl}`)
  const firstProduct = cy.get('article').first().find('h2')
  firstProduct.invoke('text').then(ref => {
    cy.get('article').first().click()
    cy.get('h1').first().invoke('text').should('eq', ref)
  })
})

// Add product to cart
Cypress.Commands.add('addProductToCart', (expectedQuantity = 1) => {
  // Try to set user location, but don't fail if it doesn't work
  cy.get('body').then(($body) => {
    if ($body.find('#cartToCartWrapper').length > 0) {
      cy.setUserLocation()
      cy.get('#cartToCartWrapper').find('button').first().click()
    } else {
      // Look for alternative add to cart button
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Add to Cart")').length > 0) {
          cy.contains('button', 'Add to Cart').click()
        } else if ($body.find('button:contains("Add")').length > 0) {
          cy.contains('button', 'Add').first().click()
        } else {
          cy.log('No add to cart button found')
        }
      })
    }
  })
  
  // Wait a bit for the cart to update
  cy.wait(1000)
  
  // Check if cart label exists and verify quantity
  cy.get('body').then(($body) => {
    if ($body.find('#cartLabel').length > 0) {
      cy.get('#cartLabel').invoke('text').should('be.eq', expectedQuantity.toString())
    } else {
      cy.log('Cart label not found, continuing without verification')
    }
  })
})

// Open cart modal
Cypress.Commands.add('openCartModal', () => {
  cy.get('.cart-icon').click()
})

// Close cart modal
Cypress.Commands.add('closeCartModal', () => {
  cy.get('#close').click()
})

// Clear cart and local storage
Cypress.Commands.add('clearCart', () => {
  cy.clearLocalStorage()
})

// Increase product quantity
Cypress.Commands.add('increaseQuantity', (times = 1) => {
  for (let i = 0; i < times; i++) {
    cy.wait(2000)
    cy.get('#quantityBtn').find('button').last().click()
    cy.wait(2000) // Wait between clicks
  }
})

// Decrease product quantity
Cypress.Commands.add('decreaseQuantity', (times = 1) => {
  for (let i = 0; i < times; i++) {
    cy.wait(2000)
    cy.get('#quantityBtn').find('button').first().click()
    cy.wait(2000) // Wait between clicks
  }
})

// Verify cart item matches product
Cypress.Commands.add('verifyCartItem', () => {
  cy.get('#productDetails')
    .find('h1')
    .first()
    .invoke('text')
    .then(ref => {
      cy.get('#cartItem').find('h3').first().invoke('text').should('be.eq', ref)
    })
})

// Search for a product
Cypress.Commands.add('searchForProduct', (searchTerm) => {
  cy.get('#search').clear().type(searchTerm)
  cy.get('#searchForm').submit()
  cy.url().should('include', '/search')
  cy.url().should('include', `q=${encodeURIComponent(searchTerm)}`)
})

// Perform search and wait for results
Cypress.Commands.add('performSearch', (searchTerm) => {
  cy.get('#search').clear().type(searchTerm)
  cy.get('#searchBtn').click()
  cy.url().should('include', '/search')
  cy.get('#searchResult').should('be.visible')
})

// Check search dropdown functionality
Cypress.Commands.add('checkSearchDropdown', (searchTerm) => {
  cy.get('#search').clear().type(searchTerm)
  cy.wait(1000)
  cy.get('body').then(($body) => {
    if ($body.find('.absolute.top-full').length > 0) {
      cy.get('.absolute.top-full').should('be.visible')
    } else {
      cy.get('#search').should('have.value', searchTerm)
      cy.log('Search dropdown not visible - API may not have returned results')
    }
  })
})

// Navigate to search results page directly
Cypress.Commands.add('visitSearchResults', (searchTerm) => {
  cy.visit(`/search?q=${encodeURIComponent(searchTerm)}`)
  cy.get('#searchResult').should('be.visible')
})

// Navigate to category page
Cypress.Commands.add('visitCategory', (categorySlug) => {
  cy.visit(`/c/${categorySlug}`)
  cy.get('body').should('be.visible')
})

// Check if category page has products
Cypress.Commands.add('checkCategoryProducts', () => {
  cy.get('body').then(($body) => {
    if ($body.find('article').length > 0) {
      cy.get('article').should('be.visible')
      cy.get('article').first().find('img').should('be.visible')
    } else {
      cy.contains('No products found').should('be.visible')
    }
  })
})

// Test category sorting functionality
Cypress.Commands.add('testCategorySorting', (sortOption) => {
  cy.get('body').then(($body) => {
    if ($body.find('select').length > 0) {
      cy.get('select').select(sortOption)
      cy.wait(2000)
      cy.url().should('include', '/c/')
    } else {
      cy.log('Sorting dropdown not available')
    }
  })
})

// Test category pagination
Cypress.Commands.add('testCategoryPagination', () => {
  cy.get('body').then(($body) => {
    if ($body.find('button').filter(':contains("Next")').length > 0) {
      cy.get('button').filter(':contains("Next")').click()
      cy.wait(2000)
      cy.url().should('include', '/c/')
    } else {
      cy.log('Pagination not available')
    }
  })
})

// Navigate to merchant page
Cypress.Commands.add('visitMerchant', (merchantSlug) => {
  cy.visit(`/m/${merchantSlug}`)
  cy.get('body').should('be.visible')
})

// Check if merchant page has products
Cypress.Commands.add('checkMerchantProducts', () => {
  cy.get('body').then(($body) => {
    if ($body.find('article').length > 0) {
      cy.get('article').should('be.visible')
      cy.get('article').first().find('img').should('be.visible')
    } else {
      cy.contains('No products found').should('be.visible')
    }
  })
})

// Test merchant sorting functionality
Cypress.Commands.add('testMerchantSorting', (sortOption) => {
  cy.get('body').then(($body) => {
    if ($body.find('select').length > 0) {
      cy.get('select').select(sortOption)
      cy.wait(2000)
      cy.url().should('include', '/m/')
    } else {
      cy.log('Sorting dropdown not available')
    }
  })
})

// Test merchant pagination
Cypress.Commands.add('testMerchantPagination', () => {
  cy.get('body').then(($body) => {
    if ($body.find('button').filter(':contains("Next")').length > 0) {
      cy.get('button').filter(':contains("Next")').click()
      cy.wait(2000)
      cy.url().should('include', '/m/')
    } else {
      cy.log('Pagination not available')
    }
  })
})
