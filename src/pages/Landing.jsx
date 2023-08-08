import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div>
            <h2 className="tex-white">Welcome to the Landing Page</h2>
            <a href="/home">Ir a Inicio</a>
        </div>
    );
}

export default Landing;