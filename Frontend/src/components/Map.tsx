import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { IEventData } from '@/models/event';
import dayjs from 'dayjs';

const LayerControlsWithNoSSR = dynamic(() => import('./LayerControls'), { ssr: false });

interface MapProps {
    center: [number, number];
    zoom: number;
    scrollWheelZoom: boolean;
    allEvent: IEventData[];
}

const Map = ({ center, zoom, scrollWheelZoom, allEvent }: MapProps) => {
    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={scrollWheelZoom}>
            <LayerControlsWithNoSSR />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {allEvent.map((event) => (
                <Marker key={event._id} position={[event.proposedLocation.lat, event.proposedLocation.lng]} icon={new Icon({ iconUrl: markerIconPng.src, iconSize: [25, 41], iconAnchor: [12, 41] })} >
                    <Popup>
                        <div>
                            <h6>{event.eventName}</h6>
                            <table className='table table-borderless table-sm p-0 m-0'>
                                <tbody>
                                    <tr>
                                        <td>Proposed Date</td>
                                        <td>{dayjs(event?.proposedDates[0]).format('MM/DD/YYYY')}</td>
                                    </tr>
                                    <tr>
                                        <td>Location</td>
                                        <td>{event.proposedLocation.lat}, {event.proposedLocation.lng}</td>
                                    </tr>
                                    <tr>
                                        <td>Status</td>
                                        <td>{event.status}</td>
                                    </tr>
                                    <tr>
                                        <td>Remarks</td>
                                        <td>{event.remarks}</td>
                                    </tr>
                                    <tr>
                                        <td>Vendor</td>
                                        <td>{event?.vendorId?.vendorName}</td>
                                    </tr>
                                    <tr>
                                        <td>Created At</td>
                                        <td>{dayjs(event.createdAt).format('MM/DD/YYYY')}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};



export default Map;