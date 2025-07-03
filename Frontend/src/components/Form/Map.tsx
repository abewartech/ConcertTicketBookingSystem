import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css';

interface MapProps {
    center: [number, number];
    zoom: number;
    scrollWheelZoom: boolean;
    setMarkerPosition: (position: [number, number]) => void;
    setFieldValue: (field: string, value: string | number) => void;
}

const Map = ({ center, zoom, scrollWheelZoom, setMarkerPosition, setFieldValue }: MapProps) => {
    const MapEvents = () => {
        const map = useMapEvent('click', (e: { latlng: { lat: number; lng: number } }) => {
            setMarkerPosition([e.latlng.lat, e.latlng.lng]);
            setFieldValue('proposedLocation', `${e.latlng.lat},${e.latlng.lng}`);
            map.flyTo([e.latlng.lat, e.latlng.lng], map.getZoom());
        });
        return null;
    };
    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={scrollWheelZoom}>
            <MapEvents />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={center} icon={new Icon({ iconUrl: markerIconPng.src, iconSize: [25, 41], iconAnchor: [12, 41] })}>
                <Popup>
                    Wellness Hub
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default Map;