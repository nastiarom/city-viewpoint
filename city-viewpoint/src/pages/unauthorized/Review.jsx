import { useParams } from 'react-router-dom';
import ReviewHeader from '/src/components/ReviewHeader/ReviewHeader'
function Review() {
  const { id } = useParams();

  return (
    <>
      <ReviewHeader />
      <div>Review ID: {id}</div>
      {/* Здесь загружайте и отображайте данные отзыва по id */}
    </>
  );
}

export default Review;
