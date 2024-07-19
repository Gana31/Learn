import React from "react";
import {Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";



const PrivateRoute: React.FC = () => {
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    return accessToken ? <Outlet/> : <Navigate to="/" replace/>
    
};

export default PrivateRoute;
