import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function Chart({ charData }) {
    return <Line data={charData} />;
}

export default Chart;