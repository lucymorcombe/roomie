// import { useSession } from './SessionInfo';
// import { Navigate } from 'react-router-dom';

// function ProtectedRoute({ children }) {
//   const { session } = useSession();

//   if (session.loading) return <div>Loading...</div>;
//   if (!session.loggedIn) return <Navigate to="/login" />;

//   return children;
// }

// export default ProtectedRoute;