import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoomDetail } from "../store/slices/rooms";
import { fetchRoomImages } from "../store/slices/room_images";
import { useParams, useNavigate } from "react-router-dom";
import {   userIsCustomer } from  "../utils/permissions"; 

const RoomDetails = () => {
  const { _id } = useParams();
  const dispatch = useDispatch();
  const { roomDetail, loading, error } = useSelector((state) => state.rooms);
  const { images } = useSelector((state) => state.roomImages);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (_id) {
      dispatch(fetchRoomDetail(_id));
      dispatch(fetchRoomImages(_id));
    }
    window.scrollTo(0, 0);
  }, [dispatch, _id]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#F9F5F1'
      }}>
        <div className="spinner" style={{
          width: '50px',
          height: '50px',
          border: '5px solid #E8DFD5',
          borderTop: '5px solid #CD9A5E',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '2rem',
        margin: '2rem auto',
        maxWidth: '960px',
        backgroundColor: '#F9F5F1',
        borderRadius: '8px',
        border: '1px solid #B45E3A'
      }}>
        <div style={{
          backgroundColor: 'rgba(180, 94, 58, 0.1)',
          padding: '1rem',
          borderRadius: '6px',
          color: '#1A1A1A'
        }}>
          <p style={{ margin: 0, fontWeight: '500' }}>Error: {error}</p>
        </div>
      </div>
    );
  }

  const amenitiesList = roomDetail?.amenities?.split(',').map(item => item.trim()) || [];
  
  const nextImage = () => {
    setSelectedImage((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevImage = () => {
    setSelectedImage((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div style={{
      backgroundColor: '#F9F5F1',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        <button 
          onClick={() => window.history.back()}
          style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#CD9A5E',
            fontSize: '16px',
            cursor: 'pointer',
            marginBottom: '20px',
            padding: '0'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="#CD9A5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="#CD9A5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Rooms
        </button>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '24px',
          marginBottom: '32px',
          position: 'relative',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          {images.length > 0 ? (
            <>
              <div style={{
                position: 'relative',
                height: '450px',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <img
                  src={`http://127.0.0.1:8000${images[selectedImage]?.image}`}
                  alt="Room"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    transition: 'transform 0.3s ease',
                  }}
                />
                
                <button 
                  onClick={prevImage}
                  style={{
                    position: 'absolute',
                    left: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(26, 26, 26, 0.7)',
                    color: '#F9F5F1',
                    border: 'none',
                    borderRadius: '50%',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 2
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="#F9F5F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                <button 
                  onClick={nextImage}
                  style={{
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(26, 26, 26, 0.7)',
                    color: '#F9F5F1',
                    border: 'none',
                    borderRadius: '50%',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 2
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 6L15 12L9 18" stroke="#F9F5F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '20px',
                  backgroundColor: 'rgba(26, 26, 26, 0.7)',
                  color: '#F9F5F1',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px'
                }}>
                  {selectedImage + 1}/{images.length}
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                overflowX: 'auto',
                gap: '12px',
                padding: '0 16px 20px 16px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#CD9A5E #E8DFD5'
              }}>
                {images.map((image, index) => (
                  <div 
                    key={index} 
                    onClick={() => setSelectedImage(index)}
                    style={{
                      width: '100px',
                      height: '70px',
                      flexShrink: 0,
                      cursor: 'pointer',
                      border: index === selectedImage ? '3px solid #CD9A5E' : '3px solid transparent',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <img
                      src={`http://127.0.0.1:8000${image.image}`}
                      alt={`Room thumbnail ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{
              height: '300px',
              backgroundColor: '#E8DFD5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              color: '#8A8A8A'
            }}>
              No images available
            </div>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px',
          marginTop: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <h1 style={{
              margin: '0 0 16px 0',
              color: '#1A1A1A',
              fontSize: '28px',
              fontWeight: '700'
            }}>
              {roomDetail?.room_type?.room_type || "Room Type"}
            </h1>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px'
            }}>
              <span style={{
                padding: '6px 12px',
                backgroundColor: '#CD9A5E',
                color: '#FFFFFF',
                borderRadius: '20px',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                {roomDetail.price_per_night} EGP
                <span style={{fontSize: '14px'}}> per night</span>
              </span>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '24px'
            }}> 
              <div style={{
                display: 'flex',
                flexDirection: 'column'
              }}>
                <span style={{color: '#8A8A8A', fontSize: '14px'}}>Total Rooms</span>
                <span style={{color: '#1A1A1A', fontSize: '16px', fontWeight: '600'}}>
                  {roomDetail.total_rooms}
                </span>
              </div>
            </div>
              {userIsCustomer() && (
            <button onClick={() => navigate(`/addbooking/${_id}/`)}style={{
              backgroundColor: '#CD9A5E',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%',
              transition: 'background-color 0.2s ease'
            }}>
              Book Now 
            </button>
              )}
          </div>
          
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{
              color: '#1A1A1A',
              fontSize: '20px',
              marginBottom: '20px',
              fontWeight: '600'
            }}>
              Room Amenities
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '16px'
            }}>
              {amenitiesList.length > 0 ? amenitiesList.map((amenity, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'rgba(205, 154, 94, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="#CD9A5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span style={{color: '#1A1A1A'}}>{amenity}</span>
                </div>
              )) : (
                <p style={{color: '#8A8A8A', gridColumn: '1 / -1'}}>No amenities listed</p>
              )}
            </div>
            
            <div style={{marginTop: '32px'}}>
              <h2 style={{
                color: '#1A1A1A',
                fontSize: '20px',
                marginBottom: '20px',
                fontWeight: '600'
              }}>
                Room Policies
              </h2>
              
              <div style={{
                display: 'grid',
                gap: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(205, 154, 94, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#CD9A5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 6V12L16 14" stroke="#CD9A5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h4 style={{
                      margin: '0 0 4px 0',
                      color: '#1A1A1A',
                      fontSize: '15px',
                      fontWeight: '600'
                    }}>Check-in/Check-out</h4>
                    <p style={{
                      margin: '0',
                      color: '#8A8A8A',
                      fontSize: '14px'
                    }}>Check-in from 2:00 PM, Check-out before 12:00 PM</p>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(205, 154, 94, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 9V7C19 5.89543 18.1046 5 17 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V17" stroke="#CD9A5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 15L16 11M16 11H13M16 11V14" stroke="#CD9A5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h4 style={{
                      margin: '0 0 4px 0',
                      color: '#1A1A1A',
                      fontSize: '15px',
                      fontWeight: '600'
                    }}>Cancellation Policy</h4>
                    <p style={{
                      margin: '0',
                      color: '#8A8A8A',
                      fontSize: '14px'
                    }}>Free cancellation up to 24 hours before check-in</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
