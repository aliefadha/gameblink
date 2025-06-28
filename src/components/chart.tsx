import { Bar, BarChart, XAxis, Tooltip } from "recharts"
import type { TooltipProps } from "recharts"

import { ChartContainer } from "@/components/ui/chart"
import { type ChartConfig } from "@/components/ui/chart"
import type { ChartData } from "@/lib/api/dashboard"

const chartConfig = {
    countBooking: {
        label: "Jumlah Booking: ",
        color: "#61368E",
    },
} satisfies ChartConfig

interface ChartProps {
    data: ChartData[];
    isLoading?: boolean;
}

// Custom tooltip component for better styling and information display
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload || !payload.length) {
        return null;
    }

    const data = payload[0];
    const date = new Date(label);
    const formattedDate = date.toLocaleDateString('id-ID', {
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 min-w-[220px] backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="space-y-3">
                {/* Date header */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                        {formattedDate}
                    </h4>
                </div>
                
                {/* Booking count */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div 
                            className="w-3 h-3 rounded-full shadow-sm"
                            style={{ backgroundColor: chartConfig.countBooking.color }}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {chartConfig.countBooking.label}
                        </span>
                    </div>
                    <span className="font-bold text-xl text-gray-900 dark:text-gray-100">
                        {data.value}
                    </span>
                </div>
                
            </div>
        </div>
    );
};

export function Chart({ data, isLoading = false }: ChartProps) {
    // Transform data to match chart format
    const chartData = data.map(item => ({
        tanggal: new Date(item.date).toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'short' 
        }),
        date: item.date, // Keep original date for tooltip
        countBooking: item.countBooking,
    }));

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <div className="text-gray-500">Loading chart data...</div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <div className="text-gray-500">No data available</div>
            </div>
        );
    }

    return (
        <ChartContainer config={chartConfig} className="max-h-[400px] overflow-x-scroll w-full">
            <BarChart accessibilityLayer data={chartData}>
                <XAxis
                    dataKey="tanggal"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <Tooltip 
                    content={<CustomTooltip />}
                    cursor={{
                        fill: 'rgba(97, 54, 142, 0.1)',
                        stroke: 'rgba(97, 54, 142, 0.3)',
                        strokeWidth: 1,
                    }}
                    offset={10}
                    position={{ x: 0, y: 0 }}
                    wrapperStyle={{ outline: 'none' }}
                />
                <Bar dataKey="countBooking" fill="var(--color-countBooking)" radius={4} barSize={15} />
            </BarChart>
        </ChartContainer>
    )
}
