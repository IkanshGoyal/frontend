import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import { useToast } from "../context/ToastContext";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";

const ViewResponses = () => {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);
  const { showError, showSuccess } = useToast();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const response = await axios.get(`/api/responses/${formId}`);
      setResponses(response.data.responses);
      processChartData(response.data.responses);
    } catch (error) {
      showError("Error fetching responses");
    }
  };

  const processChartData = (responses) => {
    const answerCounts = {};
    responses.forEach((response) => {
      response.answers.forEach((answer) => {
        if (!answerCounts[answer.response]) {
          answerCounts[answer.response] = 0;
        }
        answerCounts[answer.response]++;
      });
    });

    const formattedData = Object.keys(answerCounts).map((key) => ({
      name: key,
      count: answerCounts[key],
    }));

    setChartData(formattedData);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      responses.map((response, index) => ({
        "Response #": index + 1,
        ...Object.fromEntries(response.answers.map((ans, i) => [`Answer ${i + 1}`, ans.response])),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");
    
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });

    saveAs(blob, `form_responses_${formId}.xlsx`);
    showSuccess("Excel file downloaded successfully!");
  };

  return (
    <div className="responses-container">
      <h2>Responses</h2>
      <button className="download-btn" onClick={downloadExcel}>Download as Excel</button>

      {responses.map((response, index) => (
        <div key={index} className="response-card">
          {response.answers.map((answer, idx) => (
            <p key={idx}>{answer.response}</p>
          ))}
        </div>
      ))}

      <h2>Response Analytics</h2>
      
      {/* Bar Chart */}
      <BarChart width={600} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>

      {/* Pie Chart */}
      <PieChart width={400} height={300}>
        <Pie data={chartData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#82ca9d" label>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={["#8884d8", "#82ca9d", "#ffc658", "#ff7300"][index % 4]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default ViewResponses;