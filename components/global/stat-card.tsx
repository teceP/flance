import { ArrowDownIcon, MoreVerticalIcon } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowUpIcon } from "@radix-ui/react-icons";

interface StatCardProps {
    title: string;
    value: number | string;
    change: number;
    isPositive: boolean;
    color?: string; // Optionaler color-Parameter
}

export function StatCard({ title, value, change, isPositive, color }: Readonly<StatCardProps>) {
    // Generate random data for the graph
    const graphData = Array.from({ length: 10 }, () => Math.floor(Math.random() * 50) + 50);

    // Calculate the SVG path for the graph
    const pathData = graphData.reduce((path, point, index) => {
        return path + (index === 0 ? `M ${index * 20},${100 - point} ` : `L ${index * 20},${100 - point} `);
    }, '');

    return (
        <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <Button variant="ghost" size="icon">
                    <MoreVerticalIcon className="h-4 w-4" />
                </Button>
            </div>
            <div className="text-3xl font-bold mb-2">{value}</div>
            <div className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'} mb-4`}>
                {isPositive ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
                {change}% Last month
            </div>
            <div className="w-full h-16">
                <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
                    <path
                        d={pathData}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                    />
                </svg>
            </div>
        </Card>
    )
}