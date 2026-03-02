import React, { useEffect } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-geometryutil';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// Fix Leaflet icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface FieldMapProps {
    onAreaChange?: (area: number, coordinates: [number, number][]) => void;
    readOnly?: boolean;
    initialPolygon?: [number, number][];
}

// Flies to the farmer's live GPS location when the draw map first mounts
const LocationFlyTo = () => {
    const map = useMap();
    useEffect(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                map.flyTo([pos.coords.latitude, pos.coords.longitude], 15, { duration: 1.5 });
            },
            () => { /* Permission denied or unavailable – stay on default India view */ }
        );
    }, [map]);
    return null;
};

// Fits the map view tightly around an existing polygon (admin read-only mode)
const FitPolygon = ({ polygon }: { polygon: [number, number][] }) => {
    const map = useMap();
    useEffect(() => {
        if (!polygon || polygon.length === 0) return;
        const bounds = L.latLngBounds(polygon.map(([lat, lng]) => L.latLng(lat, lng)));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 18 });
    }, [map, polygon]);
    return null;
};

const DrawingComponent = ({ onAreaChange, readOnly }: { onAreaChange?: (area: number, coords: [number, number][]) => void, readOnly: boolean }) => {
    const map = useMap();

    // Keep a stable ref to the latest callback so the effect never needs to re-run
    // when the parent re-renders with a new function reference.
    const onAreaChangeRef = React.useRef(onAreaChange);
    useEffect(() => { onAreaChangeRef.current = onAreaChange; }, [onAreaChange]);

    useEffect(() => {
        if (readOnly) return;

        const drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);

        const drawControl = new (L as any).Control.Draw({
            edit: { featureGroup: drawnItems },
            draw: {
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
                polygon: {
                    allowIntersection: false,
                    shapeOptions: {
                        color: '#facc15',
                        fillColor: '#84cc16',
                        fillOpacity: 0.35
                    }
                }
            }
        });

        map.addControl(drawControl);

        const calculateArea = (layer: L.Polygon) => {
            const latlngs = layer.getLatLngs() as L.LatLng[][];
            const coordinates = latlngs[0].map(ll => [ll.lat, ll.lng] as [number, number]);
            const areaInSqMeters = (L as any).GeometryUtil.geodesicArea(latlngs[0]);
            const areaInHectares = Number((areaInSqMeters / 10000).toFixed(2));
            // Use ref so this never causes the effect to re-subscribe
            onAreaChangeRef.current?.(areaInHectares, coordinates);
        };

        map.on((L as any).Draw.Event.CREATED, (e: any) => {
            const layer = e.layer;
            drawnItems.addLayer(layer);
            calculateArea(layer);
        });

        map.on((L as any).Draw.Event.EDITED, (e: any) => {
            e.layers.eachLayer((layer: any) => {
                calculateArea(layer);
            });
        });

        return () => {
            map.removeControl(drawControl);
            map.off((L as any).Draw.Event.CREATED);
            map.off((L as any).Draw.Event.EDITED);
        };
        // ✅ Only [map, readOnly] — onAreaChange intentionally excluded via ref pattern
    }, [map, readOnly]);

    return null;
};

// Toggle between satellite and street map layers inside the map
const LayerToggle = () => {
    const map = useMap();
    const [isSatellite, setIsSatellite] = React.useState(true);

    const satelliteLayer = React.useRef(
        L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            { attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics', maxZoom: 20 }
        )
    );
    const labelLayer = React.useRef(
        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            { attribution: '&copy; OpenStreetMap contributors', opacity: 0.35 }
        )
    );
    const streetLayer = React.useRef(
        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            { attribution: '&copy; OpenStreetMap contributors' }
        )
    );

    useEffect(() => {
        // Start with satellite
        satelliteLayer.current.addTo(map);
        labelLayer.current.addTo(map);
        return () => {
            satelliteLayer.current.remove();
            labelLayer.current.remove();
            streetLayer.current.remove();
        };
    }, [map]);

    const toggle = () => {
        if (isSatellite) {
            satelliteLayer.current.remove();
            labelLayer.current.remove();
            streetLayer.current.addTo(map);
        } else {
            streetLayer.current.remove();
            satelliteLayer.current.addTo(map);
            labelLayer.current.addTo(map);
        }
        setIsSatellite(!isSatellite);
    };

    return (
        <div
            onClick={toggle}
            className="leaflet-top leaflet-right"
            style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}
        >
            <button
                style={{
                    background: 'white',
                    border: '2px solid rgba(0,0,0,0.2)',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#166534',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                }}
            >
                {isSatellite ? '🗺️ Street' : '🛰️ Satellite'}
            </button>
        </div>
    );
};

const FieldMap = ({ onAreaChange, readOnly = false, initialPolygon }: FieldMapProps) => {
    return (
        <div className="h-[400px] w-full rounded-2xl overflow-hidden border-4 border-green-100 shadow-inner relative z-0">
            <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                scrollWheelZoom={true}
                className="h-full w-full"
            // No default TileLayer — LayerToggle manages tiles
            >
                <LayerToggle />
                <DrawingComponent onAreaChange={onAreaChange} readOnly={readOnly} />
                {!readOnly && <LocationFlyTo />}
                <FeatureGroup>
                    {initialPolygon && (
                        <>
                            {/* Bright yellow-green polygon stands out on satellite */}
                            <Polygon
                                positions={initialPolygon as any}
                                pathOptions={{ color: '#facc15', weight: 3, fillColor: '#84cc16', fillOpacity: 0.4 }}
                            />
                            <FitPolygon polygon={initialPolygon} />
                        </>
                    )}
                </FeatureGroup>
            </MapContainer>
            {!readOnly && (
                <div className="absolute bottom-4 left-4 z-[1000] bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/20 text-[10px] font-bold text-white uppercase tracking-widest">
                    🛰️ Satellite View · Use Polygon Tool to Draw Field
                </div>
            )}
        </div>
    );
};

export default FieldMap;
