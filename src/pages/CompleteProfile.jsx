import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CompleteProfile = () => {
  const { user } = useAuth();
  const [college, setCollege] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          college,
          gender,
          profileCompleted: true,
        },
        { merge: true },
      );

      setLoading(false);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error updating profile:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-3 ">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-lg w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-white">Complete Your Profile</h1>

        <input
          required
          placeholder="College Name"
          className="w-full p-3 bg-black border border-gray-700 text-white"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
        />

        <select
          required
          className="w-full p-3 bg-black border border-gray-700 text-white"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <button
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2 bg-prakida-flame text-white font-bold text-md tracking-widest uppercase hover:bg-prakida-flameDark w-full text-center justify-center"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </form>
    </div>
  );
};

export default CompleteProfile;
