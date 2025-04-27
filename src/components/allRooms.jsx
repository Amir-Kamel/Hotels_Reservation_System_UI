import { useSelector , useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchRooms } from "../store/slices/rooms";

function AllRooms() {
    const dispatch = useDispatch();
    const { rooms, loading, error } = useSelector((state) => state.rooms);

    useEffect(() => {
        dispatch(fetchRooms());
    }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container text-center p-3 border shadow rounded-5 bg-light">
            {rooms.map((room) => (
                <div key={room.id}>
                    <h3>{room.room_type}</h3>
                    <p>{room.amenities}</p>
                </div>
            ))}
        </div>
    );
}
export default AllRooms;