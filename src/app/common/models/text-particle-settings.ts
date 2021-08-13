import { ParticleSettings } from "./particle-settings";

export class TextParticleSettings implements ParticleSettings {
  color: string;
  font: string;
  text: string;
  x: number;
  y: number;
  mapX: number;
  mapY: number;
  name: string;
  width: number;
  height: number;
  scale: number;
  resultOffsetX: number;
  resultOffsetY: number;
  constellationDistance: number;
  constellationEffect: boolean;

  constructor(
    color: string,
    font: string,
    text: string,
    x: number,
    y: number,
    mapX: number,
    mapY: number,
    name: string,
    width: number,
    height: number,
    scale: number,
    resultOffsetX: number,
    resultOffsetY: number,
    constellationDistance: number,
    constellationEffect: boolean,
  ) {
    this.color = color;
    this.font = font;
    this.text = text;
    this.x = x;
    this.y = y;
    this.mapX = mapX;
    this.mapY = mapY;
    this.name = name;
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.resultOffsetX = resultOffsetX;
    this.resultOffsetY = resultOffsetY;
    this.constellationDistance = constellationDistance;
    this.constellationEffect = constellationEffect;
  }// ==============================
}// ==============================