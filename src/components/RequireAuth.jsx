import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();
    
//^ The user can be in three states: 1) logged in and authorized 2) login and  not authorized 3) not logged in

//& we are going to check the roles that are stored in our state and then we are going to find if the allowed roles include any of the roles provided in allowedRoles if we found atleast one we will pass otherwise we will check to see if a user exist if it does we send him to the unauthorized page if the user isnt logged in we navigate to login

//& outlet represent any child components of required auth so only if w have a user it will show the child components
    
    const pass = () =>{
        if (auth?.roles?.find(role => allowedRoles?.includes(role))){
          return( <Outlet/>)
        }
        else if(auth?.user){
          return( <Navigate to="/unauthorized" state={{ from: location }} replace />)
        }
        else{
          return( <Navigate to="/login" state={{ from: location }} replace />)
        }
    }

      return (
        pass()
      )
}

export default RequireAuth;

