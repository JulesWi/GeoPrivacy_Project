import { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import bcrypt from 'bcrypt';
import { generateToken } from '../middleware/auth';

// Contrôleur d'authentification
export const authController = {
  // Fonction d'inscription
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, username, publicKey } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: 'Cet email est déjà utilisé' });
      return;
      }

      // Créer un nouvel utilisateur
      const newUser = new User({
        email,
        password, // Le modèle se chargera du hachage via pre-save
        username: username || email.split('@')[0], // Username par défaut basé sur l'email
        publicKey
      });

      // Sauvegarder l'utilisateur
      await newUser.save();

      // Générer un token JWT
      const token = generateToken(newUser);

      // Renvoyer la réponse
      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        token,
        user: {
          id: newUser._id,
          email: newUser.email,
          username: newUser.username
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({ message: 'Erreur lors de l\'inscription' });
    }
  },

  // Fonction de connexion
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Trouver l'utilisateur
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        return;
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        return;
      }

      // Générer un token JWT
      const token = generateToken(user);

      // Renvoyer la réponse
      res.status(200).json({
        message: 'Connexion réussie',
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username
        }
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
  }
};
