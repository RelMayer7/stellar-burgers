const INGREDIENT_MAIN_1 = '[data-cy=ingredient-main-1]';
const INGREDIENT_MAIN_2 = '[data-cy=ingredient-main-2]';
const INGREDIENT_BUN_1 = '[data-cy=ingredient-bun-1]';
const CONSTRUCTOR_MAIN_1 = '[data-cy=constructor-main-1]';
const CONSTRUCTOR_MAIN_2 = '[data-cy=constructor-main-2]';
const CONSTRUCTOR_BUN_TOP = '[data-cy=constructor-bun-top]';
const CONSTRUCTOR_BUN_BOTTOM = '[data-cy=constructor-bun-bottom]';
const INGREDIENT_NAME_MAIN_1 = '[data-cy=ingredientName-main-1]';
const INGREDIENT_PRICE_MAIN_1 = '[data-cy=ingredientPrice-main-1]';
const INGREDIENT_IMAGE_MAIN_1 = '[data-cy=ingredientImage-main-1]';
const MODAL = '[data-cy=modal]';
const MODAL_OVERLAY = '[data-cy=modal-overlay]';
const ORDER_BUTTON = '[data-cy=orderButton]';
const NO_BUNS_TOP = '[data-cy=noBunsTop]';
const NO_BUNS_BOTTOM = '[data-cy=noBunsBottom]';
const NO_INGREDIENTS = '[data-cy=noIngredietns]';
const PRICE_ORDER = '[data-cy=priceOrder]';


describe('тесты для страницы конструктора бургера', () => {

  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients'});
    cy.intercept('GET', 'api/auth/user', { fixture: 'user'});
    cy.intercept('POST', 'api/orders', { fixture: 'orders'}).as('orders');

    cy.visit('/');

    window.localStorage.setItem('refreshToken', JSON.stringify('test-refreshToken'));
    cy.setCookie('accessToken', 'test-accessToken');
  })

  afterEach(() => {
    window.localStorage.removeItem('refreshToken');
    cy.clearCookies();
  });

  it('ингредиенты добавляются', () => {
    cy.get(INGREDIENT_MAIN_1).contains('Добавить').click();
    cy.get(CONSTRUCTOR_MAIN_1).should('exist');

    cy.get(INGREDIENT_MAIN_2).contains('Добавить').click();
    cy.get(CONSTRUCTOR_MAIN_2).should('exist');

    cy.get(INGREDIENT_BUN_1).contains('Добавить').click();
    cy.get(CONSTRUCTOR_BUN_TOP).should('exist');
    cy.get(CONSTRUCTOR_BUN_BOTTOM).should('exist');
  })

  it('ингредиенты совпадают', () => {
    cy.get(INGREDIENT_MAIN_1).within(() => {
      cy.get(INGREDIENT_NAME_MAIN_1).invoke('text').as('ingredientName');
      cy.get(INGREDIENT_PRICE_MAIN_1).invoke('text').as('ingredientPrice');
      cy.get(INGREDIENT_IMAGE_MAIN_1).invoke('attr', 'src').as('ingredientImage');
    });

    cy.get(INGREDIENT_MAIN_1).contains('Добавить').click();
 
    cy.get(CONSTRUCTOR_MAIN_1).within(() => {
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
    cy.get(INGREDIENT_MAIN_1).click();
    cy.get(MODAL).should('exist');
    cy.get(MODAL).within(() => {
      cy.get('h3').should('contain', 'Биокотлета из марсианской Магнолии');
    })
  })

  it('закрытие модального окна на крестик', () => {
    cy.get(INGREDIENT_MAIN_1).click();
    cy.get(MODAL).should('exist');

    cy.get(MODAL).within(() => {
      cy.get('button').click();
    });

    cy.get(MODAL).should('not.exist');
  })

  it('закрытие модального при клике на оверлей', () => {
    cy.get(INGREDIENT_MAIN_1).click();
    cy.get(MODAL).should('exist');

    cy.get(MODAL_OVERLAY).click({ force: true });

    cy.get(MODAL).should('not.exist');
  })

  it('создание заказа', () => {
    cy.get(INGREDIENT_BUN_1).contains('Добавить').click();
    cy.get(INGREDIENT_MAIN_1).contains('Добавить').click();

    cy.get(ORDER_BUTTON).click();

    cy.get(MODAL).should('exist');
    cy.get(MODAL).within(() => {
      cy.get('h2').should('contain', '68420');
    })

    cy.get(MODAL).within(() => {
      cy.get('button').click();
    });
    cy.get(MODAL).should('not.exist');

    cy.get(NO_BUNS_TOP).should('exist');
    cy.get(NO_BUNS_BOTTOM).should('exist');
    cy.get(NO_INGREDIENTS).should('exist');
    cy.get(PRICE_ORDER).should('contain', '0');
  })

})