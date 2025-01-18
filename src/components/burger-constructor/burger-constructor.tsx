import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useSelector, useDispatch } from '../../services/store';
import {
  burgerConstructorSelectors,
  burgerConstructorAction
} from '../../services/slices/burgerConstructor';
import {
  postOrderBurger,
  orderSelectors,
  orderAction
} from '../../services/slices/order';
import { useNavigate } from 'react-router-dom';
import { userSelectors } from '../../services/slices/user';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(
    burgerConstructorSelectors.selectBurgerIngredients
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderRequest = useSelector(orderSelectors.selectOrderLoadingStatus);
  const orderModalData = useSelector(orderSelectors.selectOrder);
  const isAuthenticated = useSelector(userSelectors.selectIsAuthenticated);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const order: string[] = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id)
    ];
    dispatch(postOrderBurger(order));
  };
  const closeOrderModal = () => {
    navigate('/');
    dispatch(orderAction.resetOrder());
    dispatch(burgerConstructorAction.removeIngedientsInOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
