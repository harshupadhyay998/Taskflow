import { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();

  const [profileImage, setProfileImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <Navbar />

      <main className="profile-page">

        {/* Cover */}

        <div className="profile-cover"></div>

        <div className="profile-container">

          {/* Avatar */}

          <div className="profile-avatar-wrapper">

            <div className="profile-avatar">

              {profileImage ? (
                <img src={profileImage} alt="Profile" />
              ) : (
                <span>
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              )}

            </div>

            <label htmlFor="profileImage" className="change-photo">
              Change Photo
            </label>

            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />

          </div>

          {/* User Info */}

          <div className="profile-header">

            <h1>{user?.name}</h1>

            <p>{user?.email}</p>

            <div className="status">
              Active User
            </div>

          </div>

          {/* Cards */}

          <div className="profile-grid">

            <div className="profile-card">

              <h4>Full Name</h4>

              <p>{user?.name}</p>

            </div>

            <div className="profile-card">

              <h4>Email</h4>

              <p>{user?.email}</p>

            </div>

            <div className="profile-card">

              <h4>User ID</h4>

              <p>{user?._id}</p>

            </div>

            <div className="profile-card">

              <h4>Role</h4>

              <p>User</p>

            </div>

          </div>

          {/* Account */}

          <div className="account-section">

            <h2>Account Overview</h2>

            <div className="account-box">

              <div className="account-item">
                <span>Profile Completion</span>
                <strong>100%</strong>
              </div>

              <div className="progress">

                <div
                  className="progress-bar"
                  style={{ width: "100%" }}
                ></div>

              </div>

              <div className="account-item">
                <span>Account Status</span>
                <strong className="green">
                  Active
                </strong>
              </div>

              <div className="account-item">
                <span>Security</span>
                <strong>
                  Protected
                </strong>
              </div>

            </div>

          </div>

          {/* Buttons */}


        </div>

      </main>
    </>
  );
};

export default Profile;