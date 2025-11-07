import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export default function usePermisos() {
    const { user } = useContext(UserContext);
    const roles = ['Jefe de Operadores', 'Operador', 'Productor']
  
    const isValidRole = (role) => {
        return roles.includes(role);
    }

    // Funciones de control de acceso basado en roles
    const hasFullAccess = () => {
        if (!isValidRole(user?.role)) return false;
        const result = user?.role === 'Jefe de Operadores';
        return result;
    };

    return {
        hasFullAccess
    }
} 