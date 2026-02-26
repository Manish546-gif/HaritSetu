import React, { useEffect, useState } from 'react';
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

const DrawingComponent = ({ onAreaChange, readOnly }: { onAreaChange?: (area: number, coords: [number, number][]) => void, readOnly: boolean }) => {
    const map = useMap();

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
                        color: '#166534',
                        fillColor: '#22c55e',
                        fillOpacity: 0.3
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
            onAreaChange?.(areaInHectares, coordinates);
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
    }, [map, onAreaChange, readOnly]);

    return null;
};

const FieldMap = ({ onAreaChange, readOnly = false, initialPolygon }: FieldMapProps) => {
    return (
        <div className="h-[400px] w-full rounded-2xl overflow-hidden border-4 border-green-100 shadow-inner relative z-0">
            <MapContainer
                center={[20.5937, 78.9629]} // Center of India
                zoom={5}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DrawingComponent onAreaChange={onAreaChange} readOnly={readOnly} />
                <FeatureGroup>
                    {initialPolygon && (
                        <Polygon positions={initialPolygon as any} pathOptions={{ color: '#166534', fillColor: '#22c55e', fillOpacity: 0.5 }} />
                    )}
                </FeatureGroup>
            </MapContainer>
            {!readOnly && (
                <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-md p-2 rounded-lg border border-green-100 text-[10px] font-bold text-green-800 uppercase tracking-widest">
                    Use Polygon Tool to Draw Field
                </div>
            )}
        </div>
    );
};

export default FieldMap;
