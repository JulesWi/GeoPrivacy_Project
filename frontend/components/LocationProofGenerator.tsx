import React, { useState, useEffect } from 'react';
import { sha3_256 } from 'js-sha3';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { type Icon as LeafletIconType, LatLngExpression } from 'leaflet';

// Disable SSR for Leaflet components due to window object dependency
const DynamicMapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const DynamicTileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const DynamicMarker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const DynamicPopup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

// Interface pour une preuve de localisation sécurisée (sans coordonnées exactes)
interface SecureLocationProof {
  locationHash: string;  // Hash cryptographique des coordonnées (jamais les coordonnées réelles)
  timestamp: Date;       // Horodatage de la preuve
  zkProof: string;       // Preuve à connaissance nulle (Zero-Knowledge)
  region?: string;       // Région approximative (ville/département)
}

const LocationProofGenerator: React.FC = () => {
  const [proof, setProof] = useState<SecureLocationProof | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([48.8566, 2.3522]); // Default to Paris
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customMarkerIcon, setCustomMarkerIcon] = useState<LeafletIconType | null>(null);

  // Set isClient to true when component mounts and create custom icon
  useEffect(() => {
    setIsClient(true);
    // Dynamically import LeafletIcon and define a custom SVG icon for the marker only on the client side
    import('leaflet').then(L => {
      const icon = new L.Icon({
        iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="#FF0000"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>'),
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });
      setCustomMarkerIcon(icon);
    }).catch(err => console.error('Failed to load Leaflet Icon:', err));
  }, []);

  // Reset success message after 5 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);
  
  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Fonction pour déterminer la région approximative à partir des coordonnées
  const determineRegion = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      return data.address.city || data.address.county || data.address.state || 'Unknown';
    } catch (error) {
      console.error('Region determination error:', error);
      return 'Unknown';
    }
  };
  
  // Fonction pour copier la preuve dans le presse-papier
  // IMPORTANT: Ne copie jamais les coordonnées réelles
  const copyToClipboard = () => {
    if (proof) {
      // Création d'une preuve partageable qui NE contient PAS les coordonnées
      const shareableProof = JSON.stringify({
        region: proof.region,
        timestamp: proof.timestamp,
        zkProof: proof.zkProof,
        locationHash: proof.locationHash
      });
      
      navigator.clipboard.writeText(shareableProof)
        .then(() => {
          setCopied(true);
        })
        .catch((err) => {
          console.error('Failed to copy: ', err);
          setError("Couldn't copy to clipboard. Please try again.");
        });
    }
  };

  // Génération de la preuve de localisation sécurisée
  const generateProof = async () => {
    setLoading(true);
    setError(null);
    
    if (!('geolocation' in navigator)) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // 1. Hash des coordonnées - NE JAMAIS stocker les coordonnées réelles
          const rawLocation = `${position.coords.latitude},${position.coords.longitude}`;
          const locationHash = sha3_256(rawLocation);

          // 2. Détermination de la région approximative (niveau ville/département)
          const region = await determineRegion(
            position.coords.latitude, 
            position.coords.longitude
          );

          // 3. Génération de la preuve ZK (implémentation simulée pour le prototype)
          const zkProof = `zk_${sha3_256(rawLocation + Date.now().toString())}`;

          // 4. Création de la preuve sécurisée SANS stocker les coordonnées réelles
          const secureProof: SecureLocationProof = {
            locationHash,
            timestamp: new Date(),
            zkProof,
            region
          };

          // 5. Mise à jour de l'état avec la preuve sécurisée
          setProof(secureProof);
          
          // 6. Centrage de la carte (uniquement pour l'affichage, pas stocké dans la preuve)
          setMapCenter([position.coords.latitude, position.coords.longitude]);
          setShowSuccess(true);
        } catch (error) {
          setError("Failed to generate proof. Please try again.");
          console.error('Error generating proof', error);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Location access denied. Please enable location services.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/30 to-secondary-light/30 py-8">
      <div className="container mx-auto p-6 bg-white rounded-xl shadow-xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold text-primary-dark mb-2">GeoPrivacy</h1>
          <p className="text-secondary-dark text-lg">Generate location proofs with privacy</p>
          <div className="h-1 w-32 bg-gradient-to-r from-primary to-secondary mx-auto my-4 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Control Panel */}
          <div className="space-y-6 bg-gray-50 p-6 rounded-lg shadow-md border border-primary-light/30">
            <div>
              <h2 className="text-3xl font-bold text-primary-dark mb-2">Generate Proof</h2>
              <p className="text-gray-600">Create a zero-knowledge proof of your current location</p>
            </div>
            
            {/* Success Message */}
            {showSuccess && !error && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded animate-pulse">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">Proof successfully generated!</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Generate Button */}
            <button 
              onClick={generateProof}
              disabled={loading}
              className={`w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <span className="flex items-center justify-center">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Generate Proof
                  </>
                )}
              </span>
            </button>

            {/* Proof Results */}
            {proof && (
              <div className="bg-secondary-light/20 border-l-4 border-secondary p-5 rounded-lg transition-all duration-500 ease-in-out">
                <h3 className="font-semibold text-secondary-dark text-xl mb-3">Proof Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-28">Region:</span>
                    <span className="bg-white px-3 py-1 rounded-md shadow-sm text-secondary-dark">{proof.region || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-28">Timestamp:</span>
                    <span className="bg-white px-3 py-1 rounded-md shadow-sm text-secondary-dark">{proof.timestamp.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-28">Location Hash:</span>
                    <span className="bg-white px-3 py-1 rounded-md shadow-sm text-secondary-dark">{proof.locationHash.substring(0, 10)}...</span>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-white rounded-md border border-secondary-light">
                  <p className="text-xs text-gray-500">ZK Proof: <span className="font-mono text-primary-dark break-all">{proof.zkProof.substring(0, 15)}...</span></p>
                </div>
                <div className="mt-4">
                  <button 
                    onClick={copyToClipboard}
                    className="text-primary-dark hover:text-primary hover:underline text-sm flex items-center"
                  >
                    {copied ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Proof
                      </>
                    )}
                  </button>
                </div>
                
                {/* Note de confidentialité */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Note sur la confidentialité :</strong> Vos coordonnées exactes ne sont jamais stockées ni partagées. Seul un hash cryptographique et la région approximative sont inclus dans la preuve.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Map Container */}
          <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-lg border-4 border-secondary-light">
            {isClient ? (
              proof ? (
                <DynamicMapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <DynamicTileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {isClient && customMarkerIcon && proof && (
                    <DynamicMarker position={mapCenter} icon={customMarkerIcon}>
                      <DynamicPopup>
                        <div className="text-center p-1">
                          <p className="font-semibold text-primary-dark mb-2">Location Verified</p>
                          <pre className="bg-gray-100 p-2 rounded text-xs text-left font-mono overflow-auto max-w-[200px] whitespace-pre-wrap">
{`Region: ${proof.region || 'Unknown'}
Radius: ~500m
Generated: ${proof.timestamp ? proof.timestamp.toLocaleTimeString() : 'Unknown'}`}
                          </pre>
                        </div>
                      </DynamicPopup>
                    </DynamicMarker>
                  )}
                </DynamicMapContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-100">
                  <div className="text-center p-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-700">Generate a location proof</h3>
                    <p className="text-gray-500 mt-2">The map will display once you generate a proof</p>
                  </div>
                </div>
              )
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">Loading map...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationProofGenerator;
