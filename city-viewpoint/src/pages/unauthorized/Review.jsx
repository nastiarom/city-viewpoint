import { useParams } from 'react-router-dom';
import ReviewHeader from '/src/components/ReviewHeader/ReviewHeader'
import Footer from '../../components/Footer/Footer';
function Review() {
  const { id } = useParams();

  return (
    <>
      <ReviewHeader />
      <div>Review ID: {id}</div>
      <div>имя </div>
      <Footer />
    </>
  );
}

export default Review;
