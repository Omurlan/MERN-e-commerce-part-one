import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { auth } from '../../firebase';
import { useSelector } from 'react-redux';

function ForgotPassword({ history }) {
    const [email, setEmail] = useState();
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        if (user && user.token) history.push("/");
    }, [user, history]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const config = {
            url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT_URL,
            handleCodeInApp: true
        };

        await auth.sendPasswordResetEmail(email, config)
            .then(() => {
                setEmail('');
                setLoading(false);
                toast.success('Check your email for password reset link');
            })
            .catch((error) => {
                setLoading(false);
                toast.error(error.message);
            });
    };

    return (
        <div className="container col-md-6 offset-ms-3 p-5">
            {loading ? (
                <h4 className="danger">Loading</h4>
            ) : (
                    <h4>Forgot Password</h4>
                )}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Type your email"
                    autoFocus
                />
                <br />
                <button className="btn btn-raised" disabled={!email}>
                    Submit
                </button>
            </form>
        </div>
    )
}

export default ForgotPassword
