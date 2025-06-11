import { Bar, BarChart, XAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { type ChartConfig } from "@/components/ui/chart"

const chartData = [
    { tanggal: "1 Juni", penjualan: 186, },
    { tanggal: "2 Juni", penjualan: 305, },
    { tanggal: "3 Juni", penjualan: 237, },
    { tanggal: "4 Juni", penjualan: 73, },
    { tanggal: "5 Juni", penjualan: 209, },
    { tanggal: "6 Juni", penjualan: 214, },
]

const chartConfig = {
    penjualan: {
        label: "Penjualan",
        color: "#009B4F",
    },
} satisfies ChartConfig

export function Chart() {
    return (
        <ChartContainer config={chartConfig} className="max-h-[400px] overflow-x-scroll w-full">
            <BarChart accessibilityLayer data={chartData}>
                <XAxis
                    dataKey="tanggal"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="penjualan" fill="var(--color-penjualan)" radius={4} barSize={15} />
            </BarChart>
        </ChartContainer>
    )
}
