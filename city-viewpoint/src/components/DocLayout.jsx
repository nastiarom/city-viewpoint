import { useNavigate } from 'react-router-dom';
import bgImage from '/src/assets/reg_background_big.jpg';

const DocLayout = ({ title, children }) => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '80px 20px'
        }}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    position: 'fixed',
                    top: '20px',
                    left: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#a7bd70',
                    color: 'white',
                    border: 'none',
                    borderRadius: '30px',
                    cursor: 'pointer',
                    zIndex: 1000,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    fontSize: '1.1rem'
                }}
            >
                &larr; Назад
            </button>
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '40px',
                borderRadius: '15px',
                maxWidth: '900px',
                width: '100%',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                lineHeight: '1.6',
                fontSize: '1.1rem',
                color: '#333'
            }}>
                <h1 style={{ textAlign: 'center', color: '#3a6b00', marginBottom: '30px' }}>{title}</h1>
                <div style={{ whiteSpace: 'pre-line' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DocLayout;
