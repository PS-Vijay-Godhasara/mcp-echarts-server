import { readFileSync } from 'fs';
import { join } from 'path';
import * as echarts from 'echarts/core';

export interface GeoJSON {
  type: string;
  features: any[];
}

class MapService {
  private static instance: MapService;
  private loadedMaps = new Map<string, GeoJSON>();
  private assetsPath: string;

  private constructor() {
    this.assetsPath = join(process.cwd(), 'assets', 'maps');
  }

  static getInstance(): MapService {
    if (!MapService.instance) {
      MapService.instance = new MapService();
    }
    return MapService.instance;
  }

  async loadMap(mapName: string): Promise<GeoJSON> {
    if (this.loadedMaps.has(mapName)) {
      return this.loadedMaps.get(mapName)!;
    }

    try {
      const mapPath = join(this.assetsPath, `${mapName}.json`);
      const geoJsonData = JSON.parse(readFileSync(mapPath, 'utf-8'));
      this.loadedMaps.set(mapName, geoJsonData);
      return geoJsonData;
    } catch (error) {
      throw new Error(`Failed to load map '${mapName}': ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  registerMap(name: string, geoJson: GeoJSON): void {
    echarts.registerMap(name, geoJson as any);
    this.loadedMaps.set(name, geoJson);
  }

  async ensureMapRegistered(mapName: string): Promise<void> {
    if (!this.loadedMaps.has(mapName)) {
      const geoJson = await this.loadMap(mapName);
      this.registerMap(mapName, geoJson);
    }
  }

  getAvailableMaps(): string[] {
    return ['world', 'china', 'us-states'];
  }

  isMapAvailable(mapName: string): boolean {
    return this.getAvailableMaps().includes(mapName);
  }
}

export const mapService = MapService.getInstance();