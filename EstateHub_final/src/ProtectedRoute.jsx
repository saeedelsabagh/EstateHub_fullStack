// import { Navigate } from "react-router-dom";
// import { useEstate } from "../ContextRorReducer";

// export default function ProtectedRoute({ children, role }) {
//   const { state } = useEstate();

//   if (!state.isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (role && state.user?.role !== role) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }
