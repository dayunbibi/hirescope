"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Summary statistics displayed at the top of the analytics dashboard
const summaryStats = [
  {
    label: "Total Active Jobs",
    value: "4,821",
    change: "+12.4%",
    comparison: "vs last month",
    positive: true,
  },
  {
    label: "Hiring Companies",
    value: "342",
    change: "+5.2%",
    comparison: "vs last month",
    positive: true,
  },
  {
    label: "Avg. Time to Hire",
    value: "24 days",
    change: "-2.1%",
    comparison: "vs last month",
    positive: false,
  },
  {
    label: "Avg. Salary Offered",
    value: "$124k",
    change: "+4.8%",
    comparison: "vs last year",
    positive: true,
  },
];

// Salary trend values used for the temporary chart
const salaryTrend = [
  { year: "2020", value: 38 },
  { year: "2021", value: 51 },
  { year: "2022", value: 58 },
  { year: "2023", value: 70 },
  { year: "2024", value: 88 },
];

// Work type distribution values
const workTypes = [
  { label: "Remote", percentage: 45 },
  { label: "Hybrid", percentage: 40 },
  { label: "On-site", percentage: 15 },
];

// Technology demand values
const technologies = [
  { name: "React", count: "1.2k" },
  { name: "Python", count: "980" },
  { name: "Node.js", count: "850" },
  { name: "TypeScript", count: "720" },
  { name: "AWS", count: "650" },
  { name: "Docker", count: "540" },
  { name: "SQL", count: "498" },
];

export default function AnalyticsPage() {
  // Stores the selected analytics date range
  const [dateRange, setDateRange] = useState("30");

  // Stores the selected role filter
  const [selectedRole, setSelectedRole] = useState("All");

  // Handles temporary analytics export
  const handleExport = () => {
    window.alert("Analytics export will be connected later.");
  };

  return (
    <>
      {/* Global website header */}
      <Header />

      <main className="min-h-screen bg-[#FBF9F7] px-5 py-10">
        <div className="mx-auto max-w-6xl">
          {/* Analytics page heading */}
          <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Market Insights Overview
              </h1>

              <p className="mt-2 text-gray-600">
                Analyze trends across developer jobs and hiring companies.
              </p>
            </div>

            {/* Dashboard controls */}
            <div className="flex flex-wrap gap-3">
              <select
                aria-label="Select analytics date range"
                value={dateRange}
                onChange={(event) => setDateRange(event.target.value)}
                className="rounded-lg border border-[#E0BFBF] bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#800020]"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="365">Last Year</option>
              </select>

              <select
                aria-label="Select developer role"
                value={selectedRole}
                onChange={(event) => setSelectedRole(event.target.value)}
                className="rounded-lg border border-[#E0BFBF] bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#800020]"
              >
                <option value="All">All Roles</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Full Stack">Full Stack</option>
                <option value="Data">Data</option>
                <option value="DevOps">DevOps</option>
              </select>

              <button
                type="button"
                onClick={handleExport}
                className="rounded-lg bg-[#800020] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#570013]"
              >
                Export
              </button>
            </div>
          </section>

          {/* Summary statistic cards */}
          <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {summaryStats.map((stat) => (
              <article
                key={stat.label}
                className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm"
              >
                {/* Statistic label */}
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                  {stat.label}
                </p>

                {/* Statistic value */}
                <p className="mt-5 text-4xl font-bold text-gray-900">
                  {stat.value}
                </p>

                {/* Statistic change */}
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                  <span
                    className={
                      stat.positive
                        ? "font-semibold text-green-600"
                        : "font-semibold text-red-600"
                    }
                  >
                    {stat.positive ? "↗" : "↘"} {stat.change}
                  </span>

                  <span className="text-gray-500">
                    {stat.comparison}
                  </span>
                </div>
              </article>
            ))}
          </section>

          {/* Main analytics grid */}
          <section className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Salary trend chart */}
            <article className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Salary Trends
                </h2>

                <button
                  type="button"
                  aria-label="Open salary chart options"
                  className="text-xl text-gray-500 transition hover:text-[#800020]"
                >
                  ···
                </button>
              </div>

              {/* Temporary bar chart */}
              <div className="mt-6 rounded-lg bg-[#F5F3F1] px-4 pb-4 pt-8">
                <div className="flex h-48 items-end gap-2 sm:gap-4">
                  {salaryTrend.map((item, index) => (
                    <div
                      key={item.year}
                      className="flex h-full flex-1 flex-col justify-end"
                    >
                      <div
                        className={`w-full rounded-t-sm ${
                          index === salaryTrend.length - 1
                            ? "bg-[#800020]"
                            : "bg-[#E4E2E0]"
                        }`}
                        style={{ height: `${item.value}%` }}
                      />

                      <span
                        className={`mt-3 text-center text-xs ${
                          index === salaryTrend.length - 1
                            ? "font-bold text-[#800020]"
                            : "text-gray-500"
                        }`}
                      >
                        {item.year}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            {/* Work type distribution */}
            <article className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900">
                Work Type
              </h2>

              <div className="mt-10 space-y-7">
                {workTypes.map((workType, index) => (
                  <div key={workType.label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">
                        {workType.label}
                      </span>

                      <span className="text-gray-500">
                        {workType.percentage}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#EAE8E6]">
                      <div
                        className={
                          index === 0
                            ? "h-full rounded-full bg-[#800020]"
                            : index === 1
                              ? "h-full rounded-full bg-[#B46A78]"
                              : "h-full rounded-full bg-[#D5A8AF]"
                        }
                        style={{ width: `${workType.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          {/* Secondary analytics grid */}
          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Technology ranking */}
            <article className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900">
                Top Technologies
              </h2>

              <div className="mt-6 flex flex-wrap gap-3">
                {technologies.map((technology) => (
                  <div
                    key={technology.name}
                    className="flex items-center gap-2 rounded-md bg-[#F0F0F0] px-3 py-2"
                  >
                    <span className="text-sm font-medium text-gray-800">
                      {technology.name}
                    </span>

                    <span className="text-xs text-gray-500">
                      {technology.count}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            {/* Experience demand distribution */}
            <article className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900">
                Experience Demand
              </h2>

              {/* Experience distribution bar */}
              <div className="mt-7 flex h-12 overflow-hidden rounded-lg">
                <div className="flex w-[28%] items-center justify-center bg-[#F1DADC] text-xs font-medium text-gray-700">
                  Junior
                </div>

                <div className="flex w-[42%] items-center justify-center bg-[#C8939D] text-xs font-medium text-white">
                  Mid
                </div>

                <div className="flex w-[30%] items-center justify-center bg-[#800020] text-xs font-medium text-white">
                  Senior
                </div>
              </div>

              {/* Experience chart legend */}
              <div className="mt-4 flex flex-wrap gap-5 text-xs text-gray-500">
                <span>■ Junior (0–2y)</span>
                <span>■ Mid (3–5y)</span>
                <span>■ Senior (5y+)</span>
              </div>
            </article>
          </section>
        </div>
      </main>

      {/* Global website footer */}
      <Footer />
    </>
  );
}