import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addRoomImage } from "../store/slices/room_images";
import { fetchRoomDetail } from "../store/slices/rooms";

const AddRoomImage = () => {
  const { room_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.roomImages);
  const { roomDetail } = useSelector((state) => state.rooms);
  
  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (room_id) {
      dispatch(fetchRoomDetail(room_id));
    }
  }, [dispatch, room_id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(Math.min(progress, 90)); 
      if (progress >= 90) clearInterval(interval);
    }, 100);
    return interval;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      document.getElementById('error-message').innerText = 'Please select an image to upload.';
      document.getElementById('error-container').style.display = 'flex';
      return;
    }

    document.getElementById('error-container').style.display = 'none';
    
    setIsUploading(true);
    const progressInterval = simulateProgress();
    
    const formData = new FormData();
    formData.append('room', room_id);
    formData.append('image', imageFile);
    
    dispatch(addRoomImage(formData))
      .then(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        setTimeout(() => {
          navigate(`/roomdetails/${room_id}`);
        }, 1000);
      })
      .catch(() => {
        clearInterval(progressInterval);
        setUploadProgress(0);
        setIsUploading(false);
      });
  };

  const handleClearImage = () => {
    setImageFile(null);
    setPreviewURL(null);
  };

  return (
    <div style={{
      backgroundColor: '#F9F5F1',
      minHeight: '100vh',
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '600px',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
        </div>
        
        <h1 style={{
          color: '#1A1A1A',
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '8px',
          textAlign: 'center'
        }}>
          Add Room Image
        </h1>
        
        {roomDetail && (
          <div style={{
            backgroundColor: 'rgba(205, 154, 94, 0.1)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            border: '1px solid rgba(205, 154, 94, 0.2)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{
                fontWeight: '600', 
                color: '#1A1A1A',
                fontSize: '16px'
              }}>
                {roomDetail?.room_type?.room_type || "Room"}
              </span>
              <span style={{
                backgroundColor: '#CD9A5E',
                color: '#FFFFFF',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {roomDetail?.price_per_night || 0} EGP per night
              </span>
            </div>
            <div style={{
              display: 'flex',
              gap: '16px'
            }}>
              <span style={{
                color: '#8A8A8A',
                fontSize: '14px'
              }}>
                Total: {roomDetail?.total_rooms || 0}
              </span>
            </div>
          </div>
        )}
        
        <div id="error-container" style={{
          display: 'none',
          backgroundColor: 'rgba(180, 94, 58, 0.1)',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '20px',
          alignItems: 'center',
          gap: '12px'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#B45E3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8V12" stroke="#B45E3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16H12.01" stroke="#B45E3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span id="error-message" style={{
            color: '#B45E3A',
            fontSize: '14px'
          }}>Error message goes here</span>
        </div>
        
        {error && (
          <div style={{
            backgroundColor: 'rgba(180, 94, 58, 0.1)',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#B45E3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8V12" stroke="#B45E3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16H12.01" stroke="#B45E3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{
              color: '#B45E3A',
              fontSize: '14px'
            }}>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {!previewURL ? (
            <div 
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                border: isDragging 
                  ? '2px dashed #CD9A5E' 
                  : '2px dashed #E8DFD5',
                borderRadius: '8px',
                padding: '32px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isDragging ? 'rgba(205, 154, 94, 0.05)' : 'transparent',
                cursor: 'pointer',
                marginBottom: '24px',
                transition: 'all 0.2s ease',
                minHeight: '200px'
              }}
              onClick={() => document.getElementById('room-image-upload').click()}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#CD9A5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="8.5" cy="8.5" r="1.5" stroke="#CD9A5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 15L16 10L5 21" stroke="#CD9A5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              
              <p style={{
                color: '#8A8A8A',
                margin: '16px 0 8px 0',
                textAlign: 'center'
              }}>
                <span style={{
                  fontWeight: '600',
                  color: '#CD9A5E'
                }}>Click to upload</span> or drag and drop
              </p>
              
              <p style={{
                color: '#8A8A8A',
                margin: '0',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                PNG, JPG or WEBP (max. 5MB)
              </p>
              
              <input
                type="file"
                id="room-image-upload"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <div style={{
              position: 'relative',
              marginBottom: '24px',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <img 
                src={previewURL} 
                alt="Room Preview" 
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover'
                }} 
              />
              
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                display: 'flex',
                gap: '8px'
              }}>
                <button
                  type="button"
                  onClick={() => document.getElementById('room-image-upload').click()}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(26, 26, 26, 0.7)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                <button
                  type="button"
                  onClick={handleClearImage}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(26, 26, 26, 0.7)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 6L18 18" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                <input
                  type="file"
                  id="room-image-upload"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
              
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                padding: '12px 16px',
                backgroundColor: 'rgba(26, 26, 26, 0.7)',
                color: '#FFFFFF',
                fontSize: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>{imageFile?.name}</span>
                <span>{Math.round(imageFile?.size / 1024)} KB</span>
              </div>
            </div>
          )}
          
          {isUploading && (
            <div style={{
              marginBottom: '24px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <span style={{fontSize: '14px', color: '#8A8A8A'}}>Uploading...</span>
                <span style={{fontSize: '14px', color: '#8A8A8A'}}>{uploadProgress}%</span>
              </div>
              <div style={{
                height: '6px',
                backgroundColor: '#E8DFD5',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${uploadProgress}%`,
                  backgroundColor: '#CD9A5E',
                  borderRadius: '3px',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>
          )}
          
          <div style={{
            display: 'flex',
            gap: '16px',
            marginTop: '8px'
          }}>
            <button
              type="button"
              onClick={() => window.history.back()}
              style={{
                flex: '1',
                padding: '12px',
                backgroundColor: '#FFFFFF',
                color: '#1A1A1A',
                border: '1px solid #E8DFD5',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isUploading || !imageFile}
              style={{
                flex: '1',
                padding: '12px',
                backgroundColor: (!imageFile || isUploading) ? '#E8DFD5' : '#CD9A5E',
                color: (!imageFile || isUploading) ? '#8A8A8A' : '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: (!imageFile || isUploading) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {isUploading ? 'Uploading...' : 'Add Room Image'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomImage;
