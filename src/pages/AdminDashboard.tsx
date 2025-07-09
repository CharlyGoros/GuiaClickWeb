// src/pages/AdminDashboard.tsx
import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-[#F9FBFB] text-[#202020] flex">
            {/* Sidebar */}
            <aside className="w-56 bg-white shadow h-full p-6">
                <h2 className="text-lg font-bold mb-6 text-[#127C82]">Admin Panel</h2>
                <nav className="space-y-2">
                    <Link
                        to="#"
                        className="flex items-center gap-2 px-4 py-2 rounded bg-[#E5F6F6] text-[#127C82] font-medium"
                    >
                        <span>👥</span> Users
                    </Link>
                    <Link
                        to="#"
                        className="flex items-center gap-2 px-4 py-2 rounded hover:bg-[#F1F5F5] text-[#127C82] font-medium"
                    >
                        <span>📘</span> Manuals
                    </Link>
                </nav>
            </aside>

            {/* Main Panel */}
            <main className="flex-1 p-10">
                <h1 className="text-2xl font-bold mb-6 text-[#127C82]">Dashboard</h1>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="bg-white rounded shadow p-6">
                        <p className="text-gray-500">Total Users</p>
                        <h2 className="text-2xl font-semibold">1,234</h2>
                    </div>
                    <div className="bg-white rounded shadow p-6">
                        <p className="text-gray-500">Active Users</p>
                        <h2 className="text-2xl font-semibold">987</h2>
                    </div>
                </div>

                {/* User Table */}
                <div className="bg-white rounded shadow p-6 mb-10">
                    <h3 className="text-lg font-semibold mb-4">User Access</h3>
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2">Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                ["Ethan Harper", "ethan.harper@example.com", "Admin", "Active"],
                                ["Olivia Bennett", "olivia.bennett@example.com", "Editor", "Active"],
                                ["Liam Carter", "liam.carter@example.com", "Viewer", "Inactive"],
                                ["Sophia Davis", "sophia.davis@example.com", "Editor", "Active"],
                                ["Noah Evans", "noah.evans@example.com", "Viewer", "Active"],
                            ].map(([name, email, role, status], i) => (
                                <tr key={i} className="border-t">
                                    <td className="py-2">{name}</td>
                                    <td className="text-[#127C82]">{email}</td>
                                    <td>
                                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">{role}</span>
                                    </td>
                                    <td>
                                        <span className={`px-2 py-1 rounded text-xs text-white ${status === "Active" ? "bg-green-500" : "bg-gray-400"}`}>
                                            {status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Manuals Table */}
                <div className="bg-white rounded shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Manuals</h3>
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2">Title</th>
                                <th>Version</th>
                                <th>Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                ["User Guide", "1.2", "2024-01-15"],
                                ["Admin Manual", "2.0", "2024-02-20"],
                                ["Troubleshooting", "1.0", "2023-12-05"],
                            ].map(([title, version, date], i) => (
                                <tr key={i} className="border-t">
                                    <td className="py-2">{title}</td>
                                    <td className="text-[#127C82]">{version}</td>
                                    <td className="text-[#127C82]">{date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
