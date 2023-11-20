// ** Reactstrap Imports

// ** Custom Components

// ** Third Party Imports
import classnames from 'classnames';

// ** Redux Imports
import { useDispatch } from 'react-redux';

// ** Actions
import { handleSelectTask } from './store';
import Badge from '@mui/material/Badge';
import Card from '@mui/material/Card';
import { CardContent } from '@mui/material';
import { IKanbanBoardCard } from 'src/types';
import { useEffect, useState } from 'react';

interface PropsType {
  card: IKanbanBoardCard;
  onCardClick: (card: IKanbanBoardCard) => void;
}

const KanbanCard = ({ card, onCardClick }: PropsType) => {
  // ** Hooks

  // ** State
  const [stateCard, setStateCard] = useState<IKanbanBoardCard>(card);

  // ** Effects
  useEffect(() => {
    setStateCard(card);
  }, [stateCard, stateCard.isLoading]);

  const handleCardClick = () => {
    onCardClick(stateCard);
  };

  const renderLabels = () => {
    if (!stateCard.chips?.length) return null;

    return (
      <div className='mb-1'>
        {stateCard.chips.map((label: any, index: number) => {
          if (!stateCard.chips) return;

          const isLastChip = stateCard.chips[stateCard.chips.length - 1] === label;

          return (
            <Badge
              key={index}
              color='error'
              variant='dot'
              className={classnames({ 'me-75': !isLastChip })}
              sx={{
                '& .MuiBadge-badge': {
                  top: 4,
                  right: 4,
                  boxShadow: (theme) => `0 0 0 2px ${theme.palette.background.paper}`,
                },
              }}
            >
              {label}
            </Badge>

            // <Badge
            //   key={index}
            //   label={label}
            //   // color={`light-${labelColors[label]}`}
            //   className={classnames({ 'me-75': !isLastChip })}
            // >
            //   {label}
            // </Badge>
          );
        })}
      </div>
    );
  };

  const renderAttachmentsComments = () => {
    if ((stateCard.attachments && stateCard.attachments.length) || (stateCard.messages && stateCard.messages.length)) {
      return (
        <div className='d-flex align-items-center'>
          {stateCard.attachments && stateCard.attachments.length ? (
            <div className='d-flex align-items-center cursor-pointer me-75'>
              Paperclip
              <span>{stateCard.attachments.length}</span>
            </div>
          ) : null}
          {stateCard.messages && stateCard.messages.length ? (
            <div className='d-flex align-items-center cursor-pointer'>
              MessageSquare
              <span>{stateCard.messages.length}</span>
            </div>
          ) : null}
        </div>
      );
    } else {
      return null;
    }
  };

  const taskFooterClasses = () => {
    if (stateCard.messages && !stateCard.messages.length && stateCard.attachments && !stateCard.attachments.length) {
      return 'justify-content-end';
    } else {
      return 'justify-content-between';
    }
  };

  const renderTaskFooter = () => {
    return (stateCard.attachments && stateCard.attachments.length) ||
      (stateCard.messages && stateCard.messages.length) ||
      (stateCard.members && stateCard.members.length) ? (
      <div className={`task-footer d-flex align-items-center mt-1 ${taskFooterClasses()}`}>
        {renderAttachmentsComments()}
        {/* {task.assignedTo.length ? (
          <div>{task.assignedTo.length ? <AvatarGroup data={task.assignedTo} /> : null}</div>
        ) : null} */}
      </div>
    ) : null;
  };

  return (
    <Card
      onClick={handleCardClick}
      className='task'
      data-board-id={stateCard.boardId}
      data-task-id={stateCard.id}
      style={stateCard.isLoading ? { backgroundColor: 'gray' } : {}}
    >
      <CardContent data-task-id={stateCard.id}>
        {renderLabels()}

        {!!stateCard.coverImageUrl && (
          <img className='img-fluid rounded task-img mb-1' alt={stateCard.title} src={stateCard.coverImageUrl} />
        )}

        <span className='task-title'>{stateCard.title}</span>

        {renderTaskFooter()}
      </CardContent>
    </Card>
  );
};

export default KanbanCard;
