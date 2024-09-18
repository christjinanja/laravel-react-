import { Link, Navigate, Outlet } from "react-router-dom"; // Importation des composants nécessaires pour la navigation
import { useStateContext } from "../context/ContextProvider"; // Accès au contexte de l'application
import axiosClient from "../axios-client.js"; // Importation de l'instance Axios configurée
import { useEffect } from "react"; // Pour gérer les effets secondaires

export default function DefaultLayout() {
  const { user, token, setUser, setToken, notification } = useStateContext(); // Récupération des valeurs du contexte

  // Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
  if (!token) {
    return <Navigate to="/login" />
  }

  // Fonction pour déconnexion
  const onLogout = ev => {
    ev.preventDefault(); // Empêche le rechargement de la page

    // Envoi d'une requête de déconnexion au serveur
    axiosClient.post('/logout')
      .then(() => {
        setUser({}); // Réinitialisation de l'utilisateur
        setToken(null); // Suppression du token
      });
  };

  // Récupération des données de l'utilisateur à l'initialisation du composant
  useEffect(() => {
    axiosClient.get('/user')
      .then(({ data }) => {
        setUser(data); // Mise à jour des données de l'utilisateur dans le contexte
      });
  }, []); // Le tableau vide signifie que cet effet ne s'exécute qu'une seule fois

  return (
    <div id="defaultLayout">
      <aside>
        <Link to="/dashboard">Dashboard</Link> {/* Lien vers le tableau de bord */}
        <Link to="/users">Utilisateurs</Link> {/* Lien vers la liste des utilisateurs */}
      </aside>
      <div className="content">
        <header>
          <div>
            En-tête {/* Section d'en-tête */}
          </div>

          <div>
            {user.name} &nbsp; &nbsp; {/* Affiche le nom de l'utilisateur */}
            <a onClick={onLogout} className="btn-logout" href="#">Déconnexion</a> {/* Lien pour se déconnecter */}
          </div>
        </header>
        <main>
          <Outlet /> {/* Permet l'affichage des sous-composants */}
        </main>
        {notification &&
          <div className="notification">
            {notification} {/* Affiche la notification si elle existe */}
          </div>
        }
      </div>
    </div>
  );
}
