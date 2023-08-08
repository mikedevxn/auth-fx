import React, { useState } from 'react';
import { auth } from '../firebase';

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();

        try {
            await auth.sendPasswordResetEmail(email);
            setMessage('Se ha enviado un correo electrónico para restablecer la contraseña.');
        } catch (error) {
            setMessage('Error al enviar el correo electrónico. Verifica la dirección de correo electrónico.');
        }
    };

    return (
        <div>
            <h2>Restablecer Contraseña</h2>
            <form onSubmit={handleResetPassword}>
                <input
                    type="email"
                    placeholder="Correo Electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Enviar Correo Electrónico</button>
            </form>
            <p>{message}</p>
        </div>
    );
}

export default ResetPassword;