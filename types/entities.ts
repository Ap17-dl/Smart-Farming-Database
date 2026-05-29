export type EntityName =
  | "farmers"
  | "lands"
  | "crops"
  | "plantings"
  | "sensors"
  | "sensor_data"
  | "markets"
  | "sales";

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Farmer extends BaseEntity {
  name: string;
  phone: string;
  email?: string;
  location?: string;
}

export interface Land extends BaseEntity {
  farmerId: string;
  landName: string;
  acreage: number;
  soilType?: string;
}

export interface Crop extends BaseEntity {
  name: string;
  season: string;
  variety?: string;
}

export interface Planting extends BaseEntity {
  farmerId: string;
  landId: string;
  cropId: string;
  plantedOn: string;
  expectedHarvestOn?: string;
}

export interface Sensor extends BaseEntity {
  name: string;
  sensorType: string;
  unit: string;
  location?: string;
}

export interface SensorData extends BaseEntity {
  sensorId: string;
  reading: number;
  recordedAt: string;
}

export interface Market extends BaseEntity {
  marketName: string;
  city: string;
}

export interface Sale extends BaseEntity {
  farmerId: string;
  cropId: string;
  marketId?: string;
  quantity: number;
  price: number;
  saleDate: string;
  revenue: number;
}
