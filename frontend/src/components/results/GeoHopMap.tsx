import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { EmailHop } from '@/types';
import { MapPin, AlertTriangle, ShieldCheck, Server } from 'lucide-react';

interface GeoHopMapProps {
  hops: EmailHop[];
  claimedSenderGeo?: { country: string; city: string };
  className?: string;
}

// Custom DivIcon for Leaflet markers so it's self-contained with no broken png assets
const createCustomMarker = (hop: EmailHop, isOrigin: boolean, isMismatch: boolean) => {
  const bgClass = isMismatch
    ? 'bg-danger text-white ring-4 ring-danger/30'
    : isOrigin
    ? 'bg-primary text-white ring-4 ring-primary/30'
    : 'bg-surface text-accent ring-2 ring-border';

  const html = `
    <div style="display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%;" class="${bgClass} shadow-lg">
      <span style="font-size: 11px; font-weight: bold; font-family: monospace;">${hop.hop_order}</span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
};

// Auto-center helper to fit bounds of all hops
const MapBoundsAdjuster: React.FC<{ coords: [number, number][] }> = ({ coords }) => {
  const map = useMap();
  React.useEffect(() => {
    if (coords.length > 0) {
      try {
        const bounds = L.latLngBounds(coords.map((c) => L.latLng(c[0], c[1])));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 6 });
      } catch (e) {
        // Fallback silently if bounds invalid
      }
    }
  }, [coords, map]);
  return null;
};

export const GeoHopMap: React.FC<GeoHopMapProps> = ({
  hops,
  claimedSenderGeo,
  className = ''
}) => {
  // Filter hops with valid coordinates
  const validHops = hops.filter(
    (h) => typeof h.lat === 'number' && typeof h.lng === 'number' && !isNaN(h.lat) && !isNaN(h.lng)
  );

  const polylineCoords: [number, number][] = validHops.map((h) => [h.lat, h.lng]);

  // Center on first valid hop or global default (e.g. 20, 0)
  const defaultCenter: [number, number] =
    validHops.length > 0 ? [validHops[0].lat, validHops[0].lng] : [20, 10];

  return (
    <div className={`relative w-full h-[400px] rounded-2xl overflow-hidden border border-border/80 ${className}`}>
      {/* Overlay legend */}
      <div className="absolute top-3 right-3 z-[1000] bg-surface/90 backdrop-blur-md p-3 rounded-xl border border-border/80 text-[11px] space-y-1.5 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-danger inline-block" />
          <span className="text-text-primary font-medium">True Sender Hop (Red if Spoofed)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary inline-block" />
          <span className="text-text-muted">Intermediate MTA Transit</span>
        </div>
        {claimedSenderGeo && (
          <div className="pt-1 border-t border-border/60 text-[10px] text-warning">
            Claimed: {claimedSenderGeo.city}, {claimedSenderGeo.country}
          </div>
        )}
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={2}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBoundsAdjuster coords={polylineCoords} />

        {/* Traced Route Polyline with animated glow styling */}
        {polylineCoords.length > 1 && (
          <Polyline
            positions={polylineCoords}
            pathOptions={{
              color: '#3B82F6',
              weight: 3,
              dashArray: '8, 8',
              opacity: 0.85
            }}
          />
        )}

        {/* Hop Markers */}
        {validHops.map((hop, idx) => {
          const isOrigin = idx === 0 || hop.isOrigin;
          const isMismatch = hop.isMismatch || false;

          return (
            <Marker
              key={`${hop.ip}-${idx}`}
              position={[hop.lat, hop.lng]}
              icon={createCustomMarker(hop, !!isOrigin, !!isMismatch)}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 space-y-1 text-xs font-sans">
                  <p className="font-bold text-slate-900 flex items-center gap-1">
                    <span>Hop #{hop.hop_order}: {hop.city}, {hop.country}</span>
                  </p>
                  <p className="text-slate-600 font-mono text-[11px]">IP: {hop.ip}</p>
                  <p className="text-slate-600 text-[11px]">ASN: {hop.asn}</p>
                  {isMismatch && (
                    <p className="text-red-600 font-bold text-[11px] pt-1">
                      ⚠️ Mismatch with claimed sender origin!
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
