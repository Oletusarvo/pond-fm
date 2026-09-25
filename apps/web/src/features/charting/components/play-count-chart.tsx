import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type PlayData = {
  play_date: string;
  play_count: number;
};

type PlaysPerDayChartProps = {
  data: PlayData[];
};

export function PlaysPerDayChart({ data }: PlaysPerDayChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    date: new Date(item.play_date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#e5e7eb' />
        <CustomXAxis dataKey='date' />

        <YAxis
          allowDecimals={false}
          axisLine={false}
          tickLine={false}
          fontSize={"var(--text-xs)"}
          width={0}
        />

        <Tooltip
          formatter={(value) => [value, "Plays"]}
          labelFormatter={(label) => `Date: ${label}`}
        />

        <CustomBar dataKey='play_count' />
      </BarChart>
    </ResponsiveContainer>
  );
}

type MonthlyPlayData = {
  play_month: string;
  play_count: number;
};

type PlaysPerMonthChartProps = {
  data: MonthlyPlayData[];
};

export function PlaysPerMonthChart({ data }: PlaysPerMonthChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    month: new Date(`${item.play_month}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    }),
  }));

  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#e5e7eb' />

        <CustomXAxis />
        <CustomYAxis />

        <Tooltip
          formatter={(value) => [value, "Plays"]}
          labelFormatter={(label) => `Month: ${label}`}
        />

        <CustomBar dataKey='play_count' />
      </BarChart>
    </ResponsiveContainer>
  );
}

function CustomBar(props: React.ComponentProps<typeof Bar>) {
  return <Bar {...props} fill='var(--color-primary)' radius={[4, 4, 0, 0]} barSize={6} />;
}

function CustomXAxis(props: React.ComponentProps<typeof XAxis>) {
  return <XAxis {...props} axisLine={false} tickLine={false} fontSize={"var(--text-xs)"} />;
}

function CustomYAxis(props: React.ComponentProps<typeof YAxis>) {
  return (
    <YAxis
      {...props}
      allowDecimals={false}
      axisLine={false}
      tickLine={false}
      fontSize={"var(--text-xs)"}
      width={0}
    />
  );
}
