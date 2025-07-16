import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormService } from "../hooks/useFormService";

const FormRouteDemo: React.FC = () => {
  const { formType, formEntityId } = useParams();
  const navigate = useNavigate();
  const { openForm } = useFormService();

  useEffect(() => {
    if (formType && formEntityId) {
      // Open the form modal with the given type and entity ID
      openForm(formType, {}, undefined, formEntityId)
        .then(() => {
          // After form is closed, navigate away (e.g., to dashboard or previous page)
          navigate(-1);
        })
        .catch(() => {
          // On cancel or error, also navigate away
          navigate(-1);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formType, formEntityId]);

  // Optionally, render nothing or a loading state
  return null;
};

export default FormRouteDemo;
