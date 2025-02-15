const url = 'http://localhost:4000';

describe('тесты для страницы конструктора бургера', () => {

  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients'});
    cy.intercept('GET', 'api/auth/user', { fixture: 'user'});
    cy.intercept('POST', 'api/orders', { fixture: 'orders'}).as('orders');

    cy.visit(url);

    window.localStorage.setItem('refreshToken', JSON.stringify('test-refreshToken'));
    cy.setCookie('accessToken', 'test-accessToken');
  })

  it('ингредиенты добавляются', () => {
    cy.get('[data-cy=ingredient-main-1]').contains('Добавить').click();
    cy.get('[data-cy=constructor-main-1]').should('exist');

    cy.get('[data-cy=ingredient-main-2]').contains('Добавить').click();
    cy.get('[data-cy=constructor-main-2]').should('exist');

    cy.get('[data-cy=ingredient-bun-1]').contains('Добавить').click();
    cy.get('[data-cy=constructor-bun-top]').should('exist');
    cy.get('[data-cy=constructor-bun-bottom]').should('exist');
  })

  it('ингредиенты совпадают', () => {
    cy.get('[data-cy=ingredient-main-1]').within(() => {
      cy.get('[data-cy=ingredientName-main-1]').invoke('text').as('ingredientName');
      cy.get('[data-cy=ingredientPrice-main-1]').invoke('text').as('ingredientPrice');
      cy.get('[data-cy=ingredientImage-main-1]').invoke('attr', 'src').as('ingredientImage');
    });

    cy.get('[data-cy=ingredient-main-1]').contains('Добавить').click();
 
    cy.get('[data-cy=constructor-main-1]').within(() => {
      cy.get('.constructor-element__text').invoke('text').then((constructorName) => {
        cy.get('@ingredientName').should('equal', constructorName);
      });
      cy.get('.constructor-element__price').invoke('text').then((constructorPrice) => {
        cy.get('@ingredientPrice').should('equal', constructorPrice);
      });
      cy.get('.constructor-element__image').invoke('attr', 'src').then((constructorImage)=> {
        cy.get('@ingredientImage').should('equal', constructorImage);
      });
    });

  });

  it('открытие модального окна', () => {
    cy.get('[data-cy=ingredient-main-1]').click();
    cy.get('[data-cy=modal]').should('exist');
    cy.get('[data-cy=modal]').within(() => {
      cy.get('h3').should('contain', 'Биокотлета из марсианской Магнолии');
    })
  })

  it('закрытие модального окна на крестик', () => {
    cy.get('[data-cy=ingredient-main-1]').click();
    cy.get('[data-cy=modal]').should('exist');

    cy.get('[data-cy=modal]').within(() => {
      cy.get('button').click();
    });

    cy.get('[data-cy=modal]').should('not.exist');
  })

  it('закрытие модального при клике на оверлей', () => {
    cy.get('[data-cy=ingredient-main-1]').click();
    cy.get('[data-cy=modal]').should('exist');

    cy.get('[data-cy=modal-overlay]').click({ force: true });

    cy.get('[data-cy=modal]').should('not.exist');
  })

  it('создание заказа', () => {
    cy.get('[data-cy=ingredient-bun-1]').contains('Добавить').click();
    cy.get('[data-cy=ingredient-main-1]').contains('Добавить').click();

    cy.get('[data-cy=orderButton]').click();

    cy.get('[data-cy=modal]').should('exist');
    cy.get('[data-cy=modal]').within(() => {
      cy.get('h2').should('contain', '68420');
    })

    cy.get('[data-cy=modal]').within(() => {
      cy.get('button').click();
    });
    cy.get('[data-cy=modal]').should('not.exist');

    cy.get('[data-cy=noBunsTop]').should('exist');
    cy.get('[data-cy=noBunsBottom]').should('exist');
    cy.get('[data-cy=noIngredietns]').should('exist');
    cy.get('[data-cy=priceOrder]').should('contain', '0');
  })

})