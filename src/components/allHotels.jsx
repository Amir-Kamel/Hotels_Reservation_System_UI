import { useSelector , useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchHotels } from "../store/slices/hotels";
import { fetchImages } from "../store/slices/images";

function AllHotels() {
    const dispatch = useDispatch();
    const { hotels, loading, error } = useSelector((state) => state.hotels);
    const { images } = useSelector((state) => state.images);

    useEffect(() => {
        dispatch(fetchHotels());
        dispatch(fetchImages());        
    }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container text-center p-3 border shadow rounded-5 bg-light">
            {hotels.map((hotel) => {
                const hotelImages = images.filter(img => img.hotel === hotel.id);
                const firstImage = hotelImages.length > 0 ? hotelImages[0].image : null;

                return (
                    <div key={hotel.id} className="card mb-4 p-3">
                        {firstImage && (
                           <img 
                           src={`http://127.0.0.1:8000/${firstImage}`} 
                           alt={hotel.name}
                           style={{ width: "100%", height: "200px", objectFit: "cover" }}
                           className="mb-2 rounded"
                         />
                        )}
                        <h3>{hotel.name}</h3>
                        <p>{hotel.description}</p>
                        <p>Price: {hotel.price}</p>
                    </div>
                );
            })}
        </div>
    );
}

export default AllHotels;
