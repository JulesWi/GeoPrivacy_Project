import express, { Request, Response, NextFunction } from 'express';
import LocationVerificationService from './locationService';
import DatabaseService from './services/DatabaseService';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const port: number = parseInt(process.env.PORT || '3000', 10);
const locationService = new LocationVerificationService();

// Middleware de gestion des erreurs
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: err.message
  });
};

// Initialisation
async function startServer() {
  try {
    // Connexion à la base de données
    await DatabaseService.connect();

    // Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Routes
    app.post('/verify-location', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userLat, userLon, centerLat, centerLon, maxRadius } = req.body;

        const isValid = await locationService.verifyLocation({
          userLat, 
          userLon, 
          centerLat, 
          centerLon, 
          maxRadius
        });

        res.json({ 
          verified: isValid,
          message: isValid 
            ? 'Location successfully verified' 
            : 'Location verification failed'
        });
      } catch (error) {
        next(error);
      }
    });

    app.get('/zones', (req: Request, res: Response) => {
      const zones = locationService.getPredefinedZones();
      res.json(zones);
    });

    // Gestion des routes non trouvées
    app.use((req: Request, res: Response) => {
      res.status(404).json({ error: 'Route not found' });
    });

    // Middleware de gestion des erreurs
    app.use(errorHandler);

    // Nettoyage périodique des preuves expirées
    setInterval(async () => {
      try {
        await DatabaseService.cleanExpiredProofs();
      } catch (error) {
        console.error('Erreur lors du nettoyage des preuves:', error);
      }
    }, 1000 * 60 * 60); // Toutes les heures

    // Démarrage du serveur
    const server = app.listen(port, () => {
      console.log(`GeoPrivacy server running on port ${port}`);
      console.log(`Verification service initialized`);
    });

    // Gestion de l'arrêt du serveur
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(async () => {
        await DatabaseService.disconnect();
        console.log('HTTP server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

// Lancer le serveur
startServer();

export default app;
