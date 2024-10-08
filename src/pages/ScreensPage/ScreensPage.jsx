import HeaderDashboard from '../../components/HeaderDashboard/HeaderDashboard';
import MainDashboard from '../../components/MainDashboard/MainDashboard';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOneBoard } from '../../redux/tasks/operations';
import { selectNextBoard, useTasks } from '../../redux/tasks/selectors';
import css from './ScreensPage.module.css';

const ScreensPage = ({ openModal, closeModal }) => {
  const { boards, activeBoardId, selectedBoard } = useTasks();
  const dispatch = useDispatch();
  const nextBoard = useSelector(selectNextBoard);

  useEffect(() => {
    if (boards.length > 0) {
      const boardId = activeBoardId || boards[0]?.id;
      if (boardId) {
        dispatch(fetchOneBoard(boardId));
      }
    }
  }, [activeBoardId, dispatch, boards, nextBoard]);

  return (
    <div className={css.ScreensPage}>
      {activeBoardId && selectedBoard && selectedBoard.background !== '' && (
        <picture className={css.picture}>
          <source
            srcSet={`
            ${selectedBoard.background.desktop2x} 2x, 
            ${selectedBoard.background.desktop} 1x
          `}
            media="(min-width: 1440px)"
          />
          <source
            srcSet={`
              ${selectedBoard.background.tablet2x} 2x, 
              ${selectedBoard.background.tablet} 1x
            `}
            media="(min-width: 768px)"
          />
          <source
            srcSet={`
              ${selectedBoard.background.mobile2x} 2x, 
              ${selectedBoard.background.mobile} 1x
            `}
            media="(max-width: 767px)"
          />
          <img
            className={css.img}
            src={selectedBoard.background.mobile}
            alt={selectedBoard.background.name}
          />
        </picture>
      )}
      <HeaderDashboard openModal={openModal} closeModal={closeModal} />
      <MainDashboard openModal={openModal} closeModal={closeModal} />
    </div>
  );
};

export default ScreensPage;