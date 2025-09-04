import { createContext, useState, useEffect } from "react";

export const JobAuthContext = createContext();

export const JobAuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    
}