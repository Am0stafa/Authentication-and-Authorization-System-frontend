import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';
import ReactLoading from 'react-loading';

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.error(err);
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }

        //! Avoids unwanted call to verifyRefreshToken
        !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;
    }, [])

    const load = () => {
        if(isLoading){
            return ( <ReactLoading type="spinningBubbles" color="#fff" height={'5%'} width={'5%'} /> )
        }
        else{       
            return ( <Outlet /> )
        }
    }
  
    const pass = () =>{
        //! persist is essential going to say whether we need to do that check at all
        return !persist ? <Outlet /> : load()   
    }
  
    return (
        pass()
    )
}

export default PersistLogin