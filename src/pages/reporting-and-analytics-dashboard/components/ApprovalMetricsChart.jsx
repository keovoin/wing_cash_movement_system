import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const ApprovalMetricsChart = ({ data, isLoading }) => {
  const chartData = data || [
    { name: 'Week 1', avgTime: 2.1, approvalRate: 92.5, volume: 156 },
    { name: 'Week 2', avgTime: 2.3, approvalRate: 94.2, volume: 189 },
    { name: 'Week 3', avgTime: 1.9, approvalRate: 96.1, volume: 203 },
    { name: 'Week 4', avgTime: 2.2, approvalRate: 93.8, volume: 178 },
    { name: 'Week 5', avgTime: 2.0, approvalRate: 95.4, volume: 221 },
    { name: 'Week 6', avgTime: 2.4, approvalRate: 91.7, volume: 167 },
    { name: 'Week 7', avgTime: 2.1, approvalRate: 94.9, volume: 195 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-4">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-muted-foreground">{entry?.name}:</span>
              <span className="font-medium text-popover-foreground">
                {entry?.dataKey === 'avgTime' 
                  ? `${entry?.value}h`
                  : entry?.dataKey === 'approvalRate'
                  ? `${entry?.value}%`
                  : `${entry?.value} requests`
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="Clock" size={18} className="text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Approval Metrics</h3>
            <p className="text-sm text-muted-foreground">
              Processing time and approval rate trends
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded-full" />
              <span className="text-muted-foreground">Avg Time (hours)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full" />
              <span className="text-muted-foreground">Approval Rate (%)</span>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="h-80 bg-muted animate-pulse rounded-lg" />
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                yAxisId="left"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                domain={[0, 5]}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                domain={[85, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="avgTime" 
                stroke="hsl(var(--warning))" 
                strokeWidth={3}
                name="Avg Processing Time"
                dot={{ fill: 'hsl(var(--warning))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--warning))', strokeWidth: 2 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="approvalRate" 
                stroke="hsl(var(--success))" 
                strokeWidth={3}
                name="Approval Rate"
                dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--success))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-4 grid grid-cols-4 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-xl font-bold text-warning">2.3h</div>
          <div className="text-sm text-muted-foreground">Current Avg</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-success">94.2%</div>
          <div className="text-sm text-muted-foreground">Current Rate</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-foreground">1.9h</div>
          <div className="text-sm text-muted-foreground">Best Time</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-foreground">96.1%</div>
          <div className="text-sm text-muted-foreground">Best Rate</div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalMetricsChart;