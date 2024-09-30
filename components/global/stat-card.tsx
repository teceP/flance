import { ArrowDownIcon, MoreVerticalIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { StaticDropdownMenu } from "./static-dropdown-menu";

interface StatCardProps {
    title: string;
    value: number | string;
    change: number;
    isPositive: boolean;
    color?: string; // Optionaler color-Parameter
}

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

// Funktion zur Generierung von zufälligen Daten für den oberen Chart
const generateRandomChartData = (length: number) => {
    return Array.from({ length }, (_, index) => ({
        month: `Month ${index + 1}`,
        desktop: Math.floor(Math.random() * 100),
        mobile: Math.floor(Math.random() * 100),
    }));
};

export function StatCard({ title, value, change, isPositive, color }: Readonly<StatCardProps>) {
    const randomChartData = generateRandomChartData(6); // 6 Monate

    return (
        <Card className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <StaticDropdownMenu />
            </div>
            <div className="flex flex-col md:flex-row items-start justify-between mb-2">
                <div className="flex flex-col">
                    <div className="text-3xl font-bold mb-1">{value}</div>
                    <div className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
                        {change}% Last month
                    </div>
                </div>
                <CardContent className="ml-0 md:ml-4 flex-grow">
                    <ChartContainer config={chartConfig}>
                        <AreaChart
                            accessibilityLayer
                            data={randomChartData}
                            margin={{ left: 12, right: 12 }}
                            width={0} // Feste Breite
                            height={0} // Feste Höhe
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <defs>
                                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <Area
                                dataKey="mobile"
                                type="natural"
                                fill="url(#fillMobile)"
                                fillOpacity={0.4}
                                stroke="var(--color-mobile)"
                                stackId="a"
                            />
                            <Area
                                dataKey="desktop"
                                type="natural"
                                fill="url(#fillDesktop)"
                                fillOpacity={0.4}
                                stroke="var(--color-desktop)"
                                stackId="a"
                            />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </div>
        </Card>
    );
}