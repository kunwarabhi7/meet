import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axionInstance";

const AddComment = ({ eventId, onCommentAdded, user }) => {
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const naviagte = useNavigate();

  const handleAddComment = async () => {
    if (!user) {
      alert("Please Login First");
      naviagte("/login");
      return;
    }

    if (!commentText.trim()) {
      setErrorMsg("Text field can't be empty");
      return;
    }
    try {
      setLoading(true);
      setErrorMsg("");
      const token = localStorage.getItem("token");

      await axiosInstance.post(
        `/event/${eventId}/comment`,
        {
          text: commentText,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText("");
      onCommentAdded();
    } catch (error) {
      console.error("Comment failed:", error.message);
      setErrorMsg("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:space-x-2">
      <input
        type="text"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        className="flex-1 p-2 border rounded-md"
        placeholder="Write a comment..."
      />
      <button
        onClick={handleAddComment}
        disabled={loading}
        className={`mt-2 sm:mt-0 px-4 py-2 rounded-md text-white ${
          loading
            ? "bg-teal-400 cursor-not-allowed"
            : "bg-teal-600 hover:bg-teal-700"
        }`}
      >
        {loading ? "Posting..." : "Post"}
      </button>
      {errorMsg && <p className="text-sm text-red-500 mt-2">{errorMsg}</p>}
    </div>
  );
};

export default AddComment;
