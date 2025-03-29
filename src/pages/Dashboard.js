import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdAddCircle, MdGroups } from "react-icons/md";
import axios from "../api/axios";
import { useToast } from "../context/ToastContext";
import TeamPanel from "./TeamPanel";
import "../styles.css";

const Dashboard = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [activeSection, setActiveSection] = useState("teams");
  const [teamName, setTeamName] = useState("");
  const [teamDesc, setTeamDesc] = useState("");
  const [teamId, setTeamId] = useState("");
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!email) {
      showError("Please log in first");
      navigate("/login");
      return;
    }
    fetchTeams();
  }, [email, showError, navigate]);

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`/api/teams/user/${email}`);
      setTeams(response.data);
    } catch (error) {
      showError("Failed to load teams");
    }
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim() || !teamDesc.trim()) {
      showError("Team name and description cannot be empty");
      return;
    }
    try {
      await axios.post("api/teams/create", {
        name: teamName,
        description: teamDesc,
        leaderEmail: email,
      });
      showSuccess("Team created successfully!");
      setActiveSection("teams");
      fetchTeams();
    } catch (error) {
      showError("Error creating team");
    }
  };

  const handleJoinTeam = async () => {
    if (!teamId.trim()) {
      showError("Please enter a valid Team ID");
      return;
    }
    try {
      await axios.post(`api/teams/${teamId}/join-request`, { email });
      showSuccess("Request sent to team leader!");
      setActiveSection("teams");
    } catch (error) {
      showError("Failed to send join request");
    }
  };

  return (
    <div className="dashboard-container">
             <div className="sidebar">
        <div>
          <h2>My Teams</h2>
          <ul>
            {teams.map((team) => (
              <li
                key={team.teamId}
                className={selectedTeam?.teamId === team.teamId ? "active" : ""}
                onClick={() => {
                  setSelectedTeam(team);
                  setActiveSection("teams");
                }}
              >
                {team.name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <button
            className="create-team-btn"
            onClick={() => setActiveSection("create")}
          >
            <MdAddCircle size={24} /> Create Team
          </button>
          <button
            className="join-team-btn"
            onClick={() => setActiveSection("join")}
          >
            <MdGroups size={24} /> Join Team
          </button>
        </div>
      </div>

      <div className="main-section">
        <div className="main-content">
          {activeSection === "teams" && selectedTeam ? (
            <TeamPanel team={selectedTeam} />
          ) : activeSection === "forms" ? (
            <div>
              <h3>Forms</h3>
              <p>Manage team forms here.</p>
            </div>
          ) : activeSection === "create" ? (
            <div className="create-section field">
              <h2>Create Team</h2>
              <input
                type="text"
                placeholder="Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              <textarea
                placeholder="Team Description"
                value={teamDesc}
                onChange={(e) => setTeamDesc(e.target.value)}
              />
              <button onClick={handleCreateTeam}>Create</button>
            </div>
          ) : activeSection === "join" ? (
            <div className="join-section field">
              <h2>Join Team</h2>
              <input
                type="text"
                placeholder="Enter Team ID"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
              />
              <button onClick={handleJoinTeam}>Join</button>
            </div>
          ) : activeSection === "settings" ? (
            <div>
              <h3>Team Settings</h3>
              <p>Modify team settings here.</p>
            </div>
          ) : (
            <h2>Select a section!</h2>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;