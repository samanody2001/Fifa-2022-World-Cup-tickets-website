import React from "react";
import classes from "./ChartsContainer.module.css";
import useContextStore from "../store/appContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ChartsContainer = () => {
  const { chartData } = useContextStore();

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart margin={{ top: 20 }} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" fontSize={20} />
        <YAxis fontSize={20} />
        <Tooltip />
        <Legend />
        <Bar dataKey="category1" fill="#8884d8" barSize={55} />
        <Bar dataKey="category2" fill="#82ca9d" barSize={55} />
        <Bar dataKey="category3" fill="#d66a6a" barSize={55} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ChartsContainer;
