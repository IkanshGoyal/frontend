import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useToast } from "../context/ToastContext";
import {
  FaUsers,
  FaClipboardList,
  FaPlus,
  FaCogs,
  FaTrash,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import "../styles.css";
import Forms from "./Forms";
import NewForm from "./NewForm";

const TeamPanel = ({ team }) => {
  const [activeTab, setActiveTab] = useState("members");
  const [teamDetails, setTeamDetails] = useState(team || null);
  const [members, setMembers] = useState([]);
  const [permissionsMap, setPermissionsMap] = useState({});
  const [joinRequests, setJoinRequests] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [teamDesc, setTeamDesc] = useState("");
  const [isLeader, setIsLeader] = useState(false);
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!email) {
      showError("Please log in first");
      navigate("/login");
      return;
    }
    if (team) {
      fetchTeamDetails();
      fetchMembers();
    }
  }, [team, email]);

  const handleJoinRequestResponse = async (userEmail, action) => {
    try {
      await axios.post(
        `/api/teams/${team.teamId}/join-request/${userEmail}/respond`,
        { action }
      );
      showSuccess(`Request ${action}ed successfully!`);
      fetchTeamDetails();
      fetchMembers();
    } catch (error) {
      showError(`Failed to ${action} request`);
    }
  };

  const handleDeleteTeam = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this team? This action cannot be undone!"
      )
    )
      return;
    try {
      await axios.delete(`/api/teams/${team.teamId}/delete`);
      showSuccess("Team deleted successfully!");
      navigate("/dashboard");
    } catch (error) {
      showError("Failed to delete team");
    }
  };

  const fetchTeamDetails = async () => {
    try {
      const response = await axios.get(`/api/teams/${team.teamId}/details`);
      setTeamDetails(response.data);
      setJoinRequests(response.data.joinRequests || []);
      setIsLeader(response.data.leaderEmail === email);
      setTeamName(response.data.name);
      setTeamDesc(response.data.description);
    } catch (error) {
      showError("Failed to load team details");
    }
  };

  const fetchMembers = async () => {
    try {
        const response = await axios.get(`/api/teams/${team.teamId}/members`);
        setMembers(response.data);

        // ✅ Initialize permissionsMap with existing permissions
        const updatedPermissionsMap = {};
        response.data.forEach(member => {
            updatedPermissionsMap[member.email] = member.permissions || []; 
        });
        setPermissionsMap(updatedPermissionsMap);
    } catch (error) {
        showError("Failed to fetch team members");
    }
};

const handlePermissionChange = (email, permission) => {
    setPermissionsMap(prev => {
        const updatedPermissions = prev[email]?.includes(permission)
            ? prev[email].filter(p => p !== permission) // Remove if exists
            : [...(prev[email] || []), permission]; // Add if not exists
        
        return { ...prev, [email]: updatedPermissions };
    });
};

const handleUpdatePermissions = async (email) => {
    try {
        await axios.put(`/api/teams/${team.teamId}/members/${email}/permissions`, {
            permissions: permissionsMap[email] || [],
        });
        showSuccess("Permissions updated successfully");

        // ✅ Refresh members after update
        fetchMembers();
    } catch (error) {
        showError("Failed to update permissions");
    }
};

  return (
    <div className="team-panel">
      <nav className="team-navbar">
        <div className="nav-buttons">
          <button onClick={() => setActiveTab("members")}>
            <FaUsers /> Team Members
          </button>
          <button onClick={() => setActiveTab("forms")}>
            <FaClipboardList /> Forms
          </button>
          <button onClick={() => setActiveTab("create-form")}>
            <FaPlus /> Create Form
          </button>
          <button onClick={() => setActiveTab("settings")}>
            <FaCogs /> Team Settings
          </button>
        </div>
      </nav>

      <div className="team-content">
        {activeTab === "members" && (
          <div>
            <h2>Team Members</h2>
            <ul>
              {members.map((member) => (
                <li key={member.email}>
                  {member.name}
                  <div className="permissions">
                    {isLeader &&
                      ["read", "write", "delete"].map((perm) => (
                        <label key={perm}>
                          <input
                            type="checkbox"
                            checked={
                              permissionsMap[member.email]?.includes(perm) ||
                              false
                            }
                            onChange={() =>
                              handlePermissionChange(member.email, perm)
                            }
                            disabled={!isLeader}
                          />
                          {perm}
                        </label>
                      ))}
                  </div>
                  {isLeader && (
                    <button
                      onClick={() =>
                        handleUpdatePermissions(
                          member.email,
                          permissionsMap[member.email]
                        )
                      }
                    >
                      Update
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "forms" && <Forms teamId={team.teamId} email={email} />}
        {activeTab === "create-form" && <NewForm teamId={team.teamId} email={email} />}

        {activeTab === "settings" && (
          <div>
            <h2>Team Settings</h2>
            <h3>Team Name</h3>
            <h4>{teamName}</h4>
            <h3>Team Id</h3>
            <h4>{team.teamId}</h4>
            <h3>Description</h3>
            <h4>{teamDesc}</h4>

            {isLeader && (
              <button
                className="delete-team-btn"
                onClick={() => handleDeleteTeam()}
              >
                <FaTrash /> Delete Team
              </button>
            )}

            <h3>Join Requests</h3>
            <ul>
              {joinRequests.length > 0 ? (
                joinRequests.map((request) => (
                  <li key={request.email}>
                    {request.email}
                    <button
                      onClick={() =>
                        handleJoinRequestResponse(request.email, "accept")
                      }
                    >
                      <FaCheck /> Accept
                    </button>
                    <button
                      onClick={() =>
                        handleJoinRequestResponse(request.email, "reject")
                      }
                    >
                      <FaTimes /> Reject
                    </button>
                  </li>
                ))
              ) : (
                <p>No pending requests</p>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamPanel;
