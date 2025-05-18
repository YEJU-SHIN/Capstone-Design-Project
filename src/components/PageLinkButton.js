import { useNavigate } from 'react-router-dom';

function PageLinkButton({ label, to, className = '' }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
  };

  return (
    <button className={`pagelink-button ${className}`} onClick={handleClick}>
      {label}
    </button>
  );
}

export default PageLinkButton;
