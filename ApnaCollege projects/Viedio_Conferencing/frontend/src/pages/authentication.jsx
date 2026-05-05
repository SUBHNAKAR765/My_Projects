import * as React from 'react';
import { Snackbar } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/authentication.css';

// formState: 0=login, 1=register, 2=forgot, 3=reset
export default function Authentication() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [resetToken, setResetToken] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    const { handleRegister, handleLogin, handleForgotPassword, handleResetPassword } = React.useContext(AuthContext);

    const clearErrors = () => setError('');

    const handleAuth = async () => {
        try {
            if (formState === 0) {
                await handleLogin(username, password);
            } else if (formState === 1) {
                const result = await handleRegister(name, username, password);
                setUsername(''); setPassword(''); setName('');
                setMessage(result);
                setOpen(true);
                clearErrors();
                setFormState(0);
            } else if (formState === 2) {
                const result = await handleForgotPassword(username);
                // In dev the token is returned directly; in prod it would be emailed
                setMessage(`Reset token: ${result.resetToken}`);
                setOpen(true);
                clearErrors();
                setFormState(3);
            } else if (formState === 3) {
                await handleResetPassword(resetToken, newPassword);
                setMessage('Password reset successfully! Please sign in.');
                setOpen(true);
                clearErrors();
                setResetToken(''); setNewPassword('');
                setFormState(0);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    const features = [
        { icon: '🎥', text: 'HD Video Conferencing' },
        { icon: '🔒', text: 'End-to-End Encrypted' },
        { icon: '👥', text: 'Host Unlimited Meetings' },
        { icon: '⚡', text: 'Low Latency, High Quality' },
    ];

    const titles = ['Welcome Back', 'Create Account', 'Forgot Password', 'Reset Password'];
    const subtitles = [
        'Sign in to continue to APNA CONNECT',
        'Join thousands of users today',
        'Enter your username to get a reset token',
        'Enter your reset token and new password',
    ];
    const btnLabels = ['Sign In', 'Create Account', 'Send Reset Token', 'Reset Password'];

    return (
        <div className="auth-page">
            {/* Left Panel */}
            <div className="auth-left">
                <div className="auth-left-content">
                    <div className="auth-brand">APNA CONNECT</div>
                    <div className="auth-tagline">Connect. Collaborate. Create.</div>
                    <div className="auth-features">
                        {features.map((f, i) => (
                            <div className="auth-feature-item" key={i}>
                                <div className="auth-feature-icon">{f.icon}</div>
                                <span>{f.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="auth-right">
                <div className="auth-card">
                    <div className="auth-card-header">
                        <div className="auth-avatar">
                            {formState === 2 || formState === 3 ? '🔑' : '🔐'}
                        </div>
                        <div className="auth-card-title">{titles[formState]}</div>
                        <div className="auth-card-subtitle">{subtitles[formState]}</div>
                    </div>

                    {/* Tabs — only for login/register */}
                    {formState <= 1 && (
                        <div className="auth-tabs">
                            <button
                                className={`auth-tab ${formState === 0 ? 'active' : 'inactive'}`}
                                onClick={() => { setFormState(0); clearErrors(); }}
                            >Sign In</button>
                            <button
                                className={`auth-tab ${formState === 1 ? 'active' : 'inactive'}`}
                                onClick={() => { setFormState(1); clearErrors(); }}
                            >Sign Up</button>
                        </div>
                    )}

                    <div className="auth-form">
                        {/* Register: full name */}
                        {formState === 1 && (
                            <div className="auth-input-group">
                                <label>Full Name</label>
                                <input className="auth-input" placeholder="John Doe"
                                    value={name} onChange={e => setName(e.target.value)} />
                            </div>
                        )}

                        {/* Login / Register / Forgot: username */}
                        {(formState === 0 || formState === 1 || formState === 2) && (
                            <div className="auth-input-group">
                                <label>Username</label>
                                <input className="auth-input" placeholder="Enter your username"
                                    value={username} onChange={e => setUsername(e.target.value)} />
                            </div>
                        )}

                        {/* Login / Register: password */}
                        {(formState === 0 || formState === 1) && (
                            <div className="auth-input-group">
                                <label>Password</label>
                                <input className="auth-input" type="password" placeholder="Enter your password"
                                    value={password} onChange={e => setPassword(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAuth()} />
                            </div>
                        )}

                        {/* Reset: token + new password */}
                        {formState === 3 && (
                            <>
                                <div className="auth-input-group">
                                    <label>Reset Token</label>
                                    <input className="auth-input" placeholder="Paste your reset token"
                                        value={resetToken} onChange={e => setResetToken(e.target.value)} />
                                </div>
                                <div className="auth-input-group">
                                    <label>New Password</label>
                                    <input className="auth-input" type="password" placeholder="Enter new password"
                                        value={newPassword} onChange={e => setNewPassword(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleAuth()} />
                                </div>
                            </>
                        )}

                        {error && <div className="auth-error">{error}</div>}

                        <button className="auth-submit-btn" onClick={handleAuth}>
                            {btnLabels[formState]}
                        </button>

                        {/* Forgot password link on login screen */}
                        {formState === 0 && (
                            <p className="auth-forgot-link" onClick={() => { setFormState(2); clearErrors(); }}>
                                Forgot password?
                            </p>
                        )}

                        {/* Back to login on forgot/reset screens */}
                        {(formState === 2 || formState === 3) && (
                            <p className="auth-forgot-link" onClick={() => { setFormState(0); clearErrors(); }}>
                                ← Back to Sign In
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <Snackbar open={open} autoHideDuration={6000} message={message} onClose={() => setOpen(false)} />
        </div>
    );
}
