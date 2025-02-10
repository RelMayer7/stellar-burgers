import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { ingredientsSelectors } from '../../services/slices/ingredients';

export const IngredientDetails: FC = () => {
  const param = useParams();
  const ingredients = useSelector(ingredientsSelectors.selectIngredients);
  /** TODO: взять переменную из стора */
  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === param.id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
