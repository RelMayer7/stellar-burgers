import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { Preloader } from '@ui';

import {
  getOrders,
  userOrdersSelectors
} from '../../services/slices/userOrders';
import { useSelector, useDispatch } from '../../services/store';
import { userSelectors } from 'src/services/slices/user';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrders());
  }, []);

  const loadingStatus = useSelector(
    userOrdersSelectors.selectOrdersLoadingStatus
  );
  const orders: TOrder[] = useSelector(userOrdersSelectors.selectOrders);

  if (loadingStatus) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
