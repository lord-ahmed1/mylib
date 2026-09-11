import { useState } from "react";

export default function Form({args}){

 
      return(
    <div style={styles.container}>
    <div style={styles.card}>
    <h2 style={styles.title}>{args.title}</h2>
    <p style={styles.subtitle}>{args.subTitle}</p>
    <div>
        {args.error && <div style={styles.errorBox}>{args.error}</div>}
                
        <form onSubmit={args.handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
                <label style={styles.label}>Username or Email</label>
                <input
                type="text"
                value={args.username}
                onChange={(e) => args.setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                style={styles.input}
                />
            </div>

            <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input
                type="password"
                value={args.password}
                onChange={(e) => args.setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={styles.input}
                />
            </div>

            <button type="submit" disabled={args.loading} style={styles.button}>
                {args.loading ? 'Signing in...' : 'Sign In'}
            </button>
            </form>
        </div>
        </div>
    </div>
        )
}


const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f6f8',
    fontFamily: 'sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    padding: '32px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '24px',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  subtitle: {
    margin: '0 0 24px 0',
    fontSize: '14px',
    color: '#666666',
    textAlign: 'center',
  },
  errorBox: {
    padding: '10px 14px',
    marginBottom: '16px',
    backgroundColor: '#ffebe9',
    color: '#d93025',
    border: '1px solid #ffc1c0',
    borderRadius: '6px',
    fontSize: '14px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#444444',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    outline: 'none',
  },
  button: {
    marginTop: '8px',
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
};