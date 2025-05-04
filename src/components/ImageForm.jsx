import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addImage } from "../store/slices/images"; 
import { fetchHotels } from "../store/slices/hotels"; 
import { useNavigate, useParams } from "react-router-dom";
import Loader from "./Loader";
const ImageForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Id } = useParams(); 
  const { hotels } = useSelector((state) => state.hotels);
  const { loading, error } = useSelector((state) => state.images);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const hotel = hotels.find((hotel) => hotel.id === parseInt(Id));

  useEffect(() => {
    if (!hotel) {
      dispatch(fetchHotels());
    }
  }, [dispatch, hotel]);

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(imageFile);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('hotel_id', Id);  
    formData.append('image', imageFile);

    dispatch(addImage(formData))
      .unwrap()
      .then(() => {
        navigate(`/hotels/detail/${Id}`); 
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error uploading image:", err);
      });
  };

  if (!hotel) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Loader />
      </div>
    );
  }

  return (
    <div className="form-container d-flex justify-content-center align-items-center m-5 bg-body">
      <div className="form-box bg-light shadow-lg rounded p-3" style={{ maxWidth: "800px", width: "100%" }}>
        <h2 className="text-primary text-center mb-4 fw-bold">
          Upload Image For  <span className="text-secondary">{hotel.name}</span>
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="image" className="form-label text-secondary fs-5">Select Image</label>
            <div className="input-group">
              <span className="input-group-text bg-primary text-light fs-5">
                <i className="bi bi-upload"></i>
              </span>
              <input
                type="file"
                id="image"
                accept="image/png, image/jpeg"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="form-control border-primary fs-5"
                required
              />
            </div>
          </div>

     
          {previewUrl && (
            <div className="card mb-4 shadow-lg">
              <img
                src={previewUrl}
                alt="Preview"
                className="card-img-top rounded"
                style={{ objectFit: "cover", height: "400px" }}
              />
              <div className="card-body">
                <p className="card-text text-center text-secondary fs-5">This is a preview of the selected image.</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100 py-3 rounded fs-5 fw-bold"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Uploading...
              </>
            ) : (
              "Upload Image"
            )}
          </button>
          {error && <p className="text-danger mt-4 text-center fs-5">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ImageForm;