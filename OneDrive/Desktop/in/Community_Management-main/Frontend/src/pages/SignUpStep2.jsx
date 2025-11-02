import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SignUpStep2() {
  const navigate = useNavigate();
  const location = useLocation();
  const prevData = location.state || {};

  const [formData, setFormData] = useState({
    address: "",
    taluka: "",
    district: "",
    state: "",
    panchayat: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBack1 = () => {
    navigate("/signup", { state: prevData });
  };

  const handleNext = (e) => {
    e.preventDefault();
    navigate("/signup/step3", { state: { ...prevData, ...formData } });
  };

  const handleback = (e) => {
    e.preventDefault();
    navigate("/signup", { state: { ...prevData } });
  }

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
              <label>Address *</label>
              <textarea
                name="address"
                placeholder="Enter your Address ........"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Taluka *</label>
              <select
                name="taluka"
                value={formData.taluka}
                onChange={handleChange}
                required
              >
                <option value="">Select your Taluka</option>
                <option value="taluka1">Taluka 1</option>
                <option value="taluka2">Taluka 2</option>
                <option value="taluka3">Taluka 3</option>
              </select>
            </div>
            <div className="form-group">
              <label>District *</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
              >
                <option value="">Select your District</option>
                <option value="district1">District 1</option>
                <option value="district2">District 2</option>
                <option value="district3">District 3</option>
              </select>
            </div>
            <div className="button-row">
              <button
                type="button"
                className="btn-primary"
                onClick={handleBack1}
              >
                ← Back
              </button>
              <button type="submit" className="btn-primary">
                Next →
              </button>
            </div>
            <div className="form-group">
              <label>State (Optional)</label>
              <input
                type="text"
                name="state"
                placeholder="Enter your State"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Panchayat (Optional)</label>
              <input
                type="text"
                name="panchayat"
                placeholder="Enter your Panchayat"
                value={formData.panchayat}
                onChange={handleChange}
              />
            </div>
            <button type="button" className="btn-secondary" onClick={handleback}>
              Back
            </button>
            <button type="submit" className="btn-primary">
              Next →
            </button>
          
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpStep2;
