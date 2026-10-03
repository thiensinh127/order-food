import { useNavigate } from "react-router-dom";
import "./BackButton.css";

const BackButton = ({ fallback = "/", label = "Back to menu" }) => {
  const navigate = useNavigate();
  const goBack = () => (window.history.length > 1 ? navigate(-1) : navigate(fallback));

  return <button className="back-button" type="button" onClick={goBack}><span aria-hidden="true">←</span>{label}</button>;
};

export default BackButton;
