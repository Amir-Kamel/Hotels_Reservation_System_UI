import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviewDetail } from '../../store/slices/reviews';
import Header from '../../components/Header';

const ReviewDetail = () => {
  const { reviewId } = useParams();
  const dispatch = useDispatch();
  const { reviewDetail, loading, error } = useSelector((state) => state.reviews);

  useEffect(() => {
    if (reviewId) {
      dispatch(fetchReviewDetail(reviewId));
    }
  }, [dispatch, reviewId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} style={{ color: i < rating ? '#CD9A5E' : '#E8DFD5', fontSize: '1.5rem' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  // if (loading) return <Loader />;

  return (
    <div style={{ backgroundColor: '#F9F5F1', minHeight: '100vh' }}>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <Link 
          to="/reviews"
          style={{
            color: '#B45F3A',
            textDecoration: 'none',
            fontWeight: '500',
            display: 'inline-block',
            marginBottom: '1.5rem'
          }}
        >
          ← Back to Reviews
        </Link>

        <h1 style={{ 
          color: '#1A1A1A', 
          marginBottom: '1.5rem',
          borderBottom: '2px solid #CD9A5E',
          paddingBottom: '0.5rem'
        }}>
          Review Details
        </h1>

        {error && (
          <div style={{ 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            padding: '1rem', 
            borderRadius: '4px',
            marginBottom: '1rem' 
          }}>
            {error}
          </div>
        )}

        {reviewDetail ? (
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '2rem',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ color: '#1A1A1A', marginBottom: '0.5rem' }}>
                {reviewDetail.hotel_details?.name || 'Hotel Name'}
              </h2>
              <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                {renderStars(reviewDetail.rating)}
                <span style={{ marginLeft: '0.5rem', color: '#8A8A8A', fontSize: '1rem' }}>
                  ({reviewDetail.rating}/5)
                </span>
              </div>
            </div>

            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: '#F9F5F1', 
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <p style={{ 
                color: '#1A1A1A', 
                lineHeight: '1.8',
                fontSize: '1.1rem',
                marginBottom: '0'
              }}>
                "{reviewDetail.comment || 'No comment provided.'}"
              </p>
            </div>

            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #E8DFD5',
              paddingTop: '1.5rem'
            }}>
              <div>
                <p style={{ color: '#1A1A1A', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  {reviewDetail.user_details?.username || 'Guest'}
                </p>
                <p style={{ color: '#8A8A8A', fontSize: '0.875rem', marginBottom: '0' }}>
                  Reviewed on {formatDate(reviewDetail.created_at || new Date())}
                </p>
              </div>
              
              <Link 
                to={`/hotels/detail/${reviewDetail.hotel_id}`}
                style={{
                  backgroundColor: '#CD9A5E',
                  color: 'black',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Visit Hotel
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 1rem',
            backgroundColor: 'white',
            borderRadius: '8px',
            color: '#8A8A8A'
          }}>
            <p>Loading review details...</p>
          </div>
        )}
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default ReviewDetail;