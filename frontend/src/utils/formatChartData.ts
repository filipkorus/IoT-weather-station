import { Intervals } from "@/components/ChartSkeleton.tsx";

const formatChartData = <DataType extends { created: Date }>(data: DataType[], timeRange: Intervals) => {
    data.sort((a, b) => a.created.getTime() - b.created.getTime());
    return data.map((entry) => {
        let toLocaleStringParams = {};
        if (timeRange === "24h") {
            toLocaleStringParams = { hour: "2-digit", minute: "2-digit" };
        } else if (timeRange === "7d") {
            toLocaleStringParams = { weekday: "long" };
        } else if (timeRange === "30d") {
            toLocaleStringParams = { day: "numeric" };
        } else if (timeRange === "1y") {
            toLocaleStringParams = { month: "long" };
        } else if (timeRange === "2y") {
            toLocaleStringParams = { month: "long", year: "numeric" };
        }
        return { ...entry, name: entry.created.toLocaleString("pl-PL", toLocaleStringParams) };
    });
};
export default formatChartData;
