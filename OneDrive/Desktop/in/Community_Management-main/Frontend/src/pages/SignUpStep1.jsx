import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUpStep1() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    date_of_birth: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    navigate("/signup/step2", { state: formData });
  };

  return (
    <div className="page-container">
      <div className="left-section">
        <div className="logo-section">
          <h1>CIVIC HUB</h1>
          <p>Your Voice, Your Region</p>
        </div>
      </div>
      <div className="right-section">
        <div className="form-card">
          <h2>Sign Up</h2>
          <form onSubmit={handleNext}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Mobile Number*</label>
              <input
                type="tel"
                name="phone_number"
                placeholder="Enter your Number"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email (Optional)</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Date of Birth*</label>
              <input
                type="date"
                name="date_of_birth"
                placeholder="dd-mm-yyyy"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Next →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpStep1;
