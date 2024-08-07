import icons from '../../images/icons.svg';
import css from './Card.module.css';
import { useDispatch } from 'react-redux';
import { deleteTask, editTask } from '../../redux/tasks/operations.js';
import { DeleteModal } from '../DeleteModal/DeleteModal.jsx';
import EditCardModal from '../EditCardModal/EditCardModal.jsx';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useTasks } from '../../redux/tasks/selectors.js';
import Portal from '../Portal/Portal.jsx';

export default function Card({
  task: { id, name, description, priority, deadline },
  openModal,
  closeModal,
  columnId,
}) {
  const [isOpenPopUp, setIsOpenPopUp] = useState(false);
  const [popUpPosition, setPopUpPosition] = useState({});
  const dispatch = useDispatch();
  const popUpRef = useRef(null);
  const buttonRef = useRef(null);
  const { columns } = useTasks();
  const dateDeadline = new Date(deadline);
  const formatedDate = `${dateDeadline.getUTCDate()}/${(dateDeadline.getUTCMonth() + 1)
    .toString()
    .padStart(2, '0')}/${dateDeadline.getFullYear()}`;
  const cardTextDescription =
    description.length > 95 ? description.substring(0, 95) + '...' : description;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dateDeadline.setHours(0, 0, 0, 0);
  const passedDeadline = today > dateDeadline;
  const isTodayDeadline = today.getTime() === dateDeadline.getTime();
  const bell = isTodayDeadline || today > dateDeadline;
  const handleClickEdit = () => {
    openModal(
      <EditCardModal
        id={id}
        name={name}
        description={description}
        priority={priority}
        deadline={deadline}
        onClose={closeModal}
      />
    );
  };
  const handleDeleteCard = () => {
    dispatch(deleteTask(id));
  };
  const getPriorityElem = () => {
    switch (priority) {
      case 'low':
        return css.elemLow;
      case 'medium':
        return css.elemMedium;
      case 'high':
        return css.elemHigh;
      default:
        return css.elemWithout;
    }
  };
  const getPriorityCircle = () => {
    switch (priority) {
      case 'low':
        return css.circleLow;
      case 'medium':
        return css.circleMedium;
      case 'high':
        return css.circleHigh;
      default:
        return css.circleWithout;
    }
  };
  const handleClickOutside = event => {
    if (buttonRef.current && buttonRef.current.contains(event.target)) {
      setIsOpenPopUp(true);
    } else if (
      popUpRef.current &&
      !popUpRef.current.contains(event.target) &&
      buttonRef.current !== event.target
    ) {
      setIsOpenPopUp(false);
    }
  };
  useEffect(() => {
    if (isOpenPopUp) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', calcPopUpPosition);
      window.addEventListener('resize', calcPopUpPosition);
      calcPopUpPosition();
      document.body.classList.add('no-scroll');
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', calcPopUpPosition);
      window.removeEventListener('resize', calcPopUpPosition);
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', calcPopUpPosition);
      window.removeEventListener('resize', calcPopUpPosition);
      document.body.classList.remove('no-scroll');
    };
  }, [isOpenPopUp]);
  const handleTogglePopUp = () => {
    setIsOpenPopUp(!isOpenPopUp);
  };
  const handleColumnSelect = newColumnId => {
    dispatch(
      editTask({
        id,
        columnId: newColumnId,
      })
    );
    setIsOpenPopUp(false);
  };
  const calcPopUpPosition = () => {
    if (buttonRef.current && popUpRef.current) {
      const btnRect = buttonRef.current.getBoundingClientRect();

      const popUpHeight = popUpRef.current.scrollHeight;
      const viewportHeight = window.innerHeight;

      let top, bottom;
      if (viewportHeight > btnRect.bottom + popUpHeight + 10) {
        top = btnRect.bottom + 10;
        bottom = 'auto';
      } else {
        top = btnRect.top - popUpHeight - 10;
        bottom = 'auto';
      }
      setPopUpPosition({
        top: `${top}px`,
        bottom: bottom !== 'auto' ? `${bottom}px` : 'auto',
        left: `${btnRect.left + 20}px`,
      });
    }
  };
  return (
    <li className={clsx(css.cardBody, getPriorityElem())}>
      <h4 className={css.cardTitle}>{name}</h4>
      <p className={css.cardDescription}>{cardTextDescription}</p>
      <div className={css.cardSolid}></div>
      <div className={css.cardDetals}>
        <div className={css.cardInformation}>
          <div className={css.priority}>
            <p className={css.priorityTitle}>Priority</p>
            <div className={css.priorityDetals}>
              <div className={clsx(css.priorityColor, getPriorityCircle())}></div>
              <p className={css.priorityTipe}>{priority}</p>
            </div>
          </div>
          <div className={css.deadline}>
            <p className={css.deadlineTitle}>Deadline</p>
            <p className={css.deadlineDate}>{formatedDate}</p>
          </div>
        </div>
        <div className={css.cardButtons}>
          <button
            type="button"
            className={clsx(css.bell, bell ? css.active : '', passedDeadline ? css.passed : '')}
          >
            <svg width={16} height={16}>
              <use href={`${icons}#icon-bell`}></use>
            </svg>
          </button>
          {columns.length > 1 && (
            <button
              type="button"
              className={css.buttonPopUp}
              ref={buttonRef}
              onClick={handleTogglePopUp}
            >
              <svg width={16} height={16} className={css.popUpIcon}>
                <use href={`${icons}#icon-arrow-circle-broken-right`}></use>
              </svg>
            </button>
          )}
          <button type="button" className={css.button} onClick={handleClickEdit}>
            <svg width={16} height={16}>
              <use href={`${icons}#icon-pencil`}></use>
            </svg>
          </button>
          <button
            type="button"
            className={css.button}
            onClick={() =>
              openModal(
                <DeleteModal closeModal={closeModal} onDelete={handleDeleteCard}>
                  Delete this task?
                </DeleteModal>
              )
            }
          >
            <svg width={16} height={16}>
              <use href={`${icons}#icon-trash-can`}></use>
            </svg>
          </button>
        </div>
      </div>
      {isOpenPopUp && (
        <Portal>
          <div
            className={css.popUp}
            ref={popUpRef}
            style={{
              top: popUpPosition.top,
              bottom: popUpPosition.bottom,
              left: popUpPosition.left,
              position: 'fixed',
            }}
          >
            <ul className={css.popUpList}>
              {columns.length > 0 &&
                columns
                  .filter(column => column.id !== columnId)
                  .map(column => {
                    return (
                      <li
                        className={css.popUpItem}
                        key={column.id}
                        onClick={() => handleColumnSelect(column.id)}
                      >
                        <div className={css.popUpBox}>
                          <p className={css.textPopUp}>
                            {' '}
                            {column.name.length > 8 ? `${column.name.slice(0, 8)}...` : column.name}
                          </p>
                          <svg width={16} height={16} className={css.popUpIcon}>
                            <use href={`${icons}#icon-arrow-circle-broken-right`}></use>
                          </svg>
                        </div>
                      </li>
                    );
                  })}
            </ul>
          </div>
        </Portal>
      )}
    </li>
  );
}