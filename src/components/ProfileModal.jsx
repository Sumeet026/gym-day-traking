import { useState } from 'react';

export default function ProfileModal({ profile, onSave, onClose }) {
  const [name, setName] = useState(profile?.name || '');
  const [photoUrl, setPhotoUrl] = useState(profile?.photoUrl || '');
  const [preview, setPreview] = useState(profile?.photoUrl || '');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500 * 1024) {
        alert('File size should be less than 500KB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave({ name, photoUrl });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-header">
          <h3><i className="fas fa-user-circle"></i> Edit Profile</h3>
          <button className="btn-icon" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="profile-photo-section">
          <div className="profile-photo-wrapper">
            {preview ? (
              <img src={preview} alt="Profile" className="profile-photo" />
            ) : (
              <div className="profile-photo-placeholder">
                <i className="fas fa-user"></i>
              </div>
            )}
            <label className="profile-photo-edit">
              <i className="fas fa-camera"></i>
              <input type="file" accept="image/*" onChange={handleFileChange} hidden />
            </label>
          </div>
          <p className="profile-photo-hint">Tap to change photo (max 500KB)</p>
        </div>

        <div className="form-group">
          <label>Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div className="modal-buttons">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>
            <i className="fas fa-check"></i> Save
          </button>
        </div>
      </div>
    </div>
  );
}
