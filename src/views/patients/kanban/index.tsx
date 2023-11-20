// ** React Imports

// ** Third Party Imports

// ** Redux Imports

// ** Actions

// ** Kanban Component

import { IKanbanBoard, IKanbanBoardCard } from 'src/types';
import KanbanBoard from './KanbanBoard';
import { useEffect, useState } from 'react';

interface PropsType {
  boards: IKanbanBoard[];
  cards: IKanbanBoardCard[];
  onCardClick: (card: IKanbanBoardCard) => void;
  onAddCard: (board: IKanbanBoard) => void;
}

const KanbanBoards = ({ boards, cards, onCardClick, onAddCard }: PropsType) => {
  const [stateCards, setStateCards] = useState<IKanbanBoardCard[]>(cards);

  useEffect(() => {
    setStateCards(cards);
  }, [cards]);

  const renderBoards = () => {
    return boards.map((board: any, index: number) => {
      // const isLastBoard = boards[boards.length - 1].id === board.id;

      return (
        <KanbanBoard
          board={board}
          cards={stateCards}
          key={`${board.id}-${index}`}
          onCardClick={onCardClick}
          onAddCard={onAddCard}
        />
      );
    });
  };

  return boards.length ? (
    <div className='kanban-application'>
      <div className='app-kanban-wrapper'>{renderBoards()}</div>
    </div>
  ) : null;
};

export default KanbanBoards;
