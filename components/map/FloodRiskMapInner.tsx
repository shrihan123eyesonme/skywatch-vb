"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { RiskLevel } from "@/lib/risk";
import { Neighborhood } from "@/data/neighborhoods";

export type NeighborhoodRisk = {
  neighborhood: Neighborhood;
  level: RiskLevel;
};

const RISK_COLOR: Record<RiskLevel, string> = {
  low: "#2f8a56",
  elevated: "#a37a12",
  high: "#c1571f",
  severe: "#b3261e",
};

const RISK_LABEL: Record<RiskLevel, string> = {
  low: "Low risk",
  elevated: "Elevated risk",
  high: "High risk",
  severe: "Severe risk",
};

export default function FloodRiskMapInner({
  neighborhoods,
}: {
  neighborhoods: NeighborhoodRisk[];
}) {
  return (
    <MapContainer
      center={[36.82, -76.03]}
      zoom={11}
      scrollWheelZoom={false}
      className="h-[420px] w-full rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {neighborhoods.map(({ neighborhood, level }) => (
        <CircleMarker
          key={neighborhood.slug}
          center={[neighborhood.lat, neighborhood.lng]}
          radius={12}
          pathOptions={{
            color: RISK_COLOR[level],
            fillColor: RISK_COLOR[level],
            fillOpacity: 0.7,
            weight: 2,
          }}
        >
          <Popup>
            <p className="font-semibold">{neighborhood.name}</p>
            <p>{RISK_LABEL[level]}</p>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
