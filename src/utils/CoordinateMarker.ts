// import { ethers } from 'ethers';
import crypto from 'crypto'; // Added for potential Node.js crypto usage

/**
 * Représentation avancée d'un marqueur de coordonnées géographiques
 */
export class CoordinateMarker {
  private readonly latitude: number;
  private readonly longitude: number;
  private readonly precision: number;

  /**
   * Crée un marqueur de coordonnées avec validation et encodage
   * @param lat Latitude
   * @param lon Longitude
   * @param precision Niveau de précision (défaut: 6 décimales)
   */
  constructor(lat: number, lon: number, precision: number = 6) {
    this.validateCoordinates(lat, lon);
    this.latitude = this.roundCoordinate(lat, precision);
    this.longitude = this.roundCoordinate(lon, precision);
    this.precision = precision;
  }

  /**
   * Valide les coordonnées géographiques
   * @param lat Latitude
   * @param lon Longitude
   * @throws {Error} Si les coordonnées sont invalides
   */
  private validateCoordinates(lat: number, lon: number): void {
    if (lat < -90 || lat > 90) {
      throw new Error('Latitude invalide. Doit être entre -90 et 90.');
    }
    if (lon < -180 || lon > 180) {
      throw new Error('Longitude invalide. Doit être entre -180 et 180.');
    }
  }

  /**
   * Arrondit une coordonnée au niveau de précision spécifié
   * @param coordinate Coordonnée à arrondir
   * @param precision Nombre de décimales
   * @returns Coordonnée arrondie
   */
  private roundCoordinate(coordinate: number, precision: number): number {
    const factor = Math.pow(10, precision);
    return Math.round(coordinate * factor) / factor;
  }

  /**
   * Génère un hash unique pour le marqueur
   * @returns Hash cryptographique des coordonnées
   */
  public generateHash(): string {
    const coordinateString = `${this.latitude},${this.longitude}`;
    // return ethers.keccak256(ethers.toUtf8Bytes(coordinateString));
    // TODO: Implement hashing with Node.js crypto or a keccak256 library if needed
    // For now, returning a simple SHA256 hash as an example, if keccak256 is not strictly required:
    // return crypto.createHash('sha256').update(coordinateString).digest('hex');
    throw new Error('Hashing function not fully implemented after removing ethers.js. Decide on keccak256 or other.');
  }

  /**
   * Représentation stylisée du marqueur
   * @returns Chaîne formatée des coordonnées
   */
  public toString(): string {
    const latDir = this.latitude >= 0 ? 'N' : 'S';
    const lonDir = this.longitude >= 0 ? 'E' : 'W';
    return `📍 ${Math.abs(this.latitude).toFixed(this.precision)}°${latDir} ${Math.abs(this.longitude).toFixed(this.precision)}°${lonDir}`;
  }

  /**
   * Convertit les coordonnées en format GeoJSON
   * @returns Objet GeoJSON
   */
  public toGeoJSON() {
    return {
      type: 'Point',
      coordinates: [this.longitude, this.latitude]
    };
  }

  /**
   * Calcule la distance avec un autre marqueur
   * @param other Autre marqueur de coordonnées
   * @returns Distance en kilomètres
   */
  public distanceTo(other: CoordinateMarker): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.toRadians(other.latitude - this.latitude);
    const dLon = this.toRadians(other.longitude - this.longitude);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(this.latitude)) * Math.cos(this.toRadians(other.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Convertit des degrés en radians
   * @param degrees Angle en degrés
   * @returns Angle en radians
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Accesseurs pour les coordonnées
   */
  public getLatitude(): number { return this.latitude; }
  public getLongitude(): number { return this.longitude; }
}

// Exemple d'utilisation
export function createLocationMarker(lat: number, lon: number) {
  try {
    const marker = new CoordinateMarker(lat, lon);
    console.log(marker.toString());
    console.log('Hash unique :', marker.generateHash());
    return marker;
  } catch (error) {
    console.error('Erreur de création du marqueur :', error);
    return null;
  }
}
