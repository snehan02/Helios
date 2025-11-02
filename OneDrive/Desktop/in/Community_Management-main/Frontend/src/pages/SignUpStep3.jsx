import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SignUpStep3() {
  const navigate = useNavigate();
  const location = useLocation();
  const prevData = location.state || {};

  const [formData, setFormData] = useState({
    voterId: "",
    wardNumber: "",
    password: "",
    confirmPassword: "",
    photo: null,
    consentMessages: false,
    consentTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const combinedData = { ...prevData, ...formData };
    const finalData = {
      name: combinedData.name,
      phone_number: combinedData.phone_number,
      email: combinedData.email || "",
      date_of_birth: combinedData.date_of_birth,
      voter_id: combinedData.voterId,
      ward_number: combinedData.wardNumber,
      address: combinedData.address || "",
      password: formData.password,
      confirm_password: formData.confirmPassword,
    };

    // Note: district, taluka, state, panchayat are FK fields that require IDs
    // They are collected in the form but not sent until we implement proper ID lookup

    try {
      setLoading(true);
      const response = await fetch('/api/users/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });
      const data = await response.json();
      
      if (response.ok) {
        alert('Signup successful!');
        navigate('/login');
      } else {
        const errMsg =
          data?.password?.[0] ||
          data?.confirm_password?.[0] ||
          data?.phone_number?.[0] ||
          data?.date_of_birth?.[0] ||
          data?.voter_id?.[0] ||
          data?.ward_number?.[0] ||
          data?.non_field_errors?.[0] ||
          (typeof data === "string" ? data : "Signup failed. Please review your details.");
        setError(errMsg);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack2 = () => {
    navigate("/signup/step2", { state: prevData });
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
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Voter Id *</label>
              <input
                type="text"
                name="voterId"
                placeholder="Enter your Voter Id number"
                value={formData.voterId}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Ward Number*</label>
              <input
                type="text"
                name="wardNumber"
                placeholder="Enter your Ward number"
                value={formData.wardNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Photo (Optional)</label>
              <div className="file-upload" style={{ height: "110px" }}>
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/jpeg,image/png"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="photo-upload"
                  className="file-upload-label"
                  style={{ padding: "20px" }}
                >
                  <span className="upload-icon">↑</span>
                  <p style={{ marginBottom: "2px" }}>
                    Click to upload your photo
                  </p>
                  <small>JPEG, PNG, (upto 10 MB)</small>
                </label>
              </div>
            </div>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="consentMessages"
                  checked={formData.consentMessages}
                  onChange={handleChange}
                />
                <span>I Contest to receive political messages and updates</span>
              </label>
            </div>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="consentTerms"
                  checked={formData.consentTerms}
                  onChange={handleChange}
                  required
                />
                <span>I Agree to the terms of data usages and privacy</span>
              </label>
            </div>
            <div className="button-row">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleBack2}
              >
                ← Back
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={{ width: "100%" }}
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </div>
            {error && (
              <div style={{ color: "red", marginTop: 10 }}>{error}</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpStep3;
