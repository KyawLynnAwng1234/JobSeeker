import { useState } from "react";
import EmployerAddForm from "./EmployerAddForm";

export default function EmployerProfileEdit() {
  const [showForm, setShowForm] = useState(false);
  const profileId = "607cfebb-426d-469d-a6fc-14de52381343"; // 👉 backend ကလာတဲ့ UUID

  const handleUpdateSuccess = (updatedProfile) => {
    console.log("Profile updated:", updatedProfile);
    setShowForm(false);
  };

  return (
    <div>
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 bg-sky-500 text-white rounded-lg"
      >
        Update
      </button>

      {showForm && (
        <EmployerAddForm
          profileId={profileId}
          onSuccess={handleUpdateSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
