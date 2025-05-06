// import { ethers } from 'ethers'; // JsonRpcProvider n'est pas utilisé ici
import { Noir } from '@noir-lang/noir_js';
import { Barretenberg } from '@aztec/bb.js'; // Correction du nom
import config from '../config'; // Ré-ajout de l'import config
import circuit from '../circuits/target/main.json'; // Chemin corrigé (et resolveJsonModule activé)

interface LocationProof {
    userLat: number;
    userLon: number;
    centerLat: number;
    centerLon: number;
    maxRadius: number;
}

class LocationVerificationService {
    private noir: Noir | null = null; // Initialisé à null
    private backend: Barretenberg | null = null; // Initialisé à null

    // Le constructeur ne peut pas être async, utiliser une méthode d'init
    constructor() {
        // this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
        // L'initialisation async sera faite dans init()
    }

    async init() {
        // Initialisation asynchrone de Barretenberg
        this.backend = await Barretenberg.new(); // Utiliser la méthode statique
        // Initialiser Noir avec seulement le circuit
        this.noir = new Noir(circuit as any); // Attend 1 argument
    }

    async verifyLocation(proof: LocationProof): Promise<boolean> {
        try {
            // 1. Exécuter le circuit pour obtenir le témoin
            const { witness } = await this.noir!.execute({
                user_lat: proof.userLat,
                user_lon: proof.userLon,
                center_lat: proof.centerLat,
                center_lon: proof.centerLon,
                max_radius: proof.maxRadius
            });

            // 2. Générer la preuve à partir du témoin avec le backend (forcer avec as any)
            const zkProof = await (this.backend! as any).generateProof(witness); // Appeler sur backend

            // 3. Vérifier la preuve avec le backend (forcer avec as any)
            const isValid = await (this.backend! as any).verifyProof(zkProof); // Appeler sur backend

            return isValid;
        } catch (error) {
            console.error('Location verification failed:', error);
            return false;
        }
    }

    async generateLocationToken(proof: LocationProof): Promise<string | null> {
        try {
            // 1. Exécuter le circuit pour obtenir le témoin
            const { witness } = await this.noir!.execute({
                user_lat: proof.userLat,
                user_lon: proof.userLon,
                center_lat: proof.centerLat,
                center_lon: proof.centerLon,
                max_radius: proof.maxRadius
            });

            // 2. Générer la preuve à partir du témoin avec le backend (forcer avec as any)
            const zkProof = await (this.backend! as any).generateProof(witness); // Appeler sur backend

            // You might want to implement a method to extract the token from the proof
            return zkProof.proofAsHex;
        } catch (error) {
            console.error('Location token generation failed:', error);
            return null;
        }
    }

    // Predefined location zones for quick verification
    getPredefinedZones(): Record<string, {lat: number, lon: number, radius: number}> {
        return {
            'Paris': { lat: 48.8566, lon: 2.3522, radius: 10 },
            'New York': { lat: 40.7128, lon: -74.0060, radius: 15 },
            'Tokyo': { lat: 35.6762, lon: 139.6503, radius: 12 }
        };
    }
}

export default LocationVerificationService;
