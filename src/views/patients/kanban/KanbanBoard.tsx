// ** React Imports
import { Fragment, useEffect, useState } from 'react';

// ** Reactstrap Imports

// ** Third Party Imports
import { ReactSortable } from 'react-sortablejs';

// ** Redux Imports

// ** Actions

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Icon from 'src/@core/components/icon';
import { IKanbanBoard, IKanbanBoardCard } from 'src/types';
import KanbanCard from './KanbanCard';
// ** Kanban Component

interface PropsType {
  board: IKanbanBoard;
  cards: IKanbanBoardCard[];
  onCardClick: (card: IKanbanBoardCard) => void;
  onAddCard: (board: IKanbanBoard) => void;
}

const KanbanBoard = ({ board, cards, onCardClick, onAddCard }: PropsType) => {
  // ** Props

  // ** States
  const [title, setTitle] = useState('');
  const [stateCards, setStateCards] = useState<IKanbanBoardCard[]>(cards);

  // ** Hooks

  useEffect(() => {
    setTitle(board.title);
  }, [board.title]);

  useEffect(() => {
    setStateCards(cards);
  }, [cards]);

  const handleAddTaskReset = () => {
    // setShowAddTask(false);
  };

  const handleAddCard = () => {
    onAddCard(board);
  };

  const handleAddTaskFormSubmit = (data: any) => {
    // handleAddTaskReset();
  };

  const sortTaskOnSameBoard = (ev: any) => {
    if (ev.from.classList[1] === ev.to.classList[1]) {
      // dispatch(
      //   // @ts-ignore
      //   reorderTasks({
      //     taskId: ev.item.dataset.taskId,
      //     targetTaskId: ev.originalEvent.target.dataset.taskId,
      //   })
      // );
    }
  };

  const moveTaskToAnotherBoard = (ev: any) => {
    // @ts-ignore
    // updateTaskBoard({
    //   taskId: ev.item.dataset.taskId,
    //   boardId: ev.item.dataset.boardId,
    //   newBoardId: ev.to.classList[1].replace('board-', ''),
    // })
  };

  return (
    <Fragment key={board.id}>
      <div className='board-wrapper'>
        <div className='d-flex align-items-center justify-content-between'>
          <div className='d-flex align-items-center board-header'>
            <Typography variant='h6' sx={{ mb: 2, textTransform: 'capitalize', ml: 3 }}>
              {title}
            </Typography>
            {/* <span  style={{ textTransform: 'capitalize' }}>

            </span> */}
            {/* <CustomTextField
              fullWidth
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className='board-title'
            /> */}
            {/* <Input className='board-title' value={title} onChange={(e) => setTitle(e.target.value)} /> */}
          </div>
          {/* <UncontrolledDropdown className='more-options-dropdown'>
            <DropdownToggle className='btn-icon' color='transparent' size='sm'>
              <MoreVertical size={20} />
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem
                href='/'
                onClick={(e) => {
                  e.preventDefault();
                  handleClearTasks();
                }}
              >
                Clear Tasks
              </DropdownItem>
              <DropdownItem
                href='/'
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteBoard();
                }}
              >
                Delete Board
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown> */}
        </div>
        <div>
          <ReactSortable
            list={stateCards}
            group='shared-group'
            setList={() => null}
            onChange={sortTaskOnSameBoard}
            onAdd={moveTaskToAnotherBoard}
            className={`tasks-wrapper board-${board.id}`}
          >
            {stateCards
              .filter((card) => {
                return card.boardId === board.id;
              })
              .map((card: IKanbanBoardCard, index: number) => {
                return <KanbanCard card={card} key={`${index}`} onCardClick={onCardClick} />;

                //  else {
                //   return <Fragment key={`${task.boardId}-${index}`}></Fragment>;
                // }
              })}
          </ReactSortable>

          <Button color='secondary' onClick={handleAddCard}>
            <Icon icon={'tabler:circle-plus'} />
            <span className='align-middle'>Add new</span>
          </Button>
        </div>
      </div>
    </Fragment>
  );
};

export default KanbanBoard;
