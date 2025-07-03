import { LayersControl, TileLayer, FeatureGroup } from 'react-leaflet';

function LayerControls() {
    return (
        <LayersControl position='bottomleft'>
            {/* Base Layers */}
            <LayersControl.BaseLayer name='Google Maps'>
                <FeatureGroup>
                    <TileLayer url='https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}'/>
                </FeatureGroup>
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name='Google Satellite'>
                <FeatureGroup>
                    <TileLayer url='https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}' />
                </FeatureGroup>
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name='Google Hybrid'>
                <FeatureGroup>
                    <TileLayer url='https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}' />
                </FeatureGroup>
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name='Esri World Street'>
                <FeatureGroup>
                    <TileLayer url='https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}' />
                </FeatureGroup>
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name='Esri Topographic'>
                <FeatureGroup>
                    <TileLayer url='https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}' />
                </FeatureGroup>
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name='Open Street Maps'>
                <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
            </LayersControl.BaseLayer>

            {/* Overlay Layers */}
            <LayersControl.Overlay name='Clouds'>
                <FeatureGroup>
                    <TileLayer url='https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=6b33f16dae3587630c60ee15fcb0b4e4' />
                </FeatureGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay name='Precipitation'>
                <FeatureGroup>
                    <TileLayer url='https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=6b33f16dae3587630c60ee15fcb0b4e4' />
                </FeatureGroup>
            </LayersControl.Overlay>
        </LayersControl>
    );
}

export default LayerControls;