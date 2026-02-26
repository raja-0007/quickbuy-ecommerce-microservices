"use client"
import React, { useState } from 'react'
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'

const ChartsSection = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('6m')
    // Mock data
    const SALES_DATA = [
        { month: 'Jan', sales: 4000, orders: 240 },
        { month: 'Feb', sales: 3000, orders: 221 },
        { month: 'Mar', sales: 2000, orders: 229 },
        { month: 'Apr', sales: 2780, orders: 200 },
        { month: 'May', sales: 1890, orders: 229 },
        { month: 'Jun', sales: 2390, orders: 200 },
    ]
    const PRODUCT_CATEGORIES = [
        { name: 'Smartphones', value: 45, fill: 'oklch(0.55 0.15 180)' },
        { name: 'Accessories', value: 30, fill: 'oklch(0.65 0.12 50)' },
        { name: 'Others', value: 25, fill: 'oklch(0.7 0.1 110)' },
    ]

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
            {/* Sales Chart */}
            <Card className="border-border bg-card lg:col-span-2">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-foreground">Sales Overview</CardTitle>
                            <CardDescription>Monthly sales and order trends</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            {['1m', '3m', '6m'].map((period) => (
                                <Button
                                    key={period}
                                    size="sm"
                                    variant={selectedPeriod === period ? 'default' : 'outline'}
                                    onClick={() => setSelectedPeriod(period)}
                                    className={
                                        selectedPeriod === period
                                            ? 'bg-primary text-primary-foreground'
                                            : 'border-border'
                                    }
                                >
                                    {period}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={SALES_DATA}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis stroke="var(--muted-foreground)" />
                            <YAxis stroke="var(--muted-foreground)" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--card)',
                                    border: '1px solid var(--border)',
                                }}
                            />
                            <Legend />
                            <Bar dataKey="sales" fill="oklch(0.55 0.15 180)" />
                            <Bar dataKey="orders" fill="oklch(0.65 0.12 50)" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card className="border-border bg-card">
                <CardHeader>
                    <CardTitle className="text-foreground">Product Distribution</CardTitle>
                    <CardDescription>By category</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={PRODUCT_CATEGORIES}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                dataKey="value"
                                label={({ name, value }) => `${name} ${value}%`}
                            >
                                {PRODUCT_CATEGORIES.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}

export default ChartsSection