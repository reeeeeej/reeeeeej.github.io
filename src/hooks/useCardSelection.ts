import { useAppStateContext } from '../app/providers/AppStateProvider';
import { cards } from '../data/cards';

export function useCardSelection() {
  const { state, dispatch } = useAppStateContext();

  const selectedCard =
    cards.find((card) => card.id === state.selectedCardId) ?? null;

  return {
    selectedCardId: state.selectedCardId,
    selectedCard,
    openDetail: (cardId: string) => {
      dispatch({ type: 'open_detail', cardId });
    },
    closeDetail: () => {
      dispatch({ type: 'close_detail' });
    },
  };
}
