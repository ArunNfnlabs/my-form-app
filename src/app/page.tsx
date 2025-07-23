/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  UserCheck, UserX, Bot, Mail, User
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserData {
  id: number;
  name: string;
  email: string;
  chatbotCreated: boolean;
  lastSeen: string;
}

interface Stats {
  totalUsers: number;
  chatbotUsers: number;
  noChatbotUsers: number;
}

type SortField = 'name' | 'email' | 'chatbotCreated' | 'lastSeen';
type SortOrder = 'asc' | 'desc';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<SortField>('lastSeen');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const itemsPerPage: number = 10;

  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/signin");
      return;
    }

    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('http://localhost:3000/users/v1/all-users-basic-info');
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();

        // Transform the API data to match UserData interface
        const mappedUsers: UserData[] = (data?.data || []).map((user: any, index: number) => ({
          id: index + 1, // generate dummy ID
          name: user.name ?? 'Unnamed User',
          email: user.email,
          chatbotCreated: user.chatbot_created,
          lastSeen: new Date().toISOString(), // add dummy lastSeen value
        }));

        setUsers(mappedUsers);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  const filteredAndSortedUsers = useMemo((): UserData[] => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      if (sortBy === 'lastSeen') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      return sortOrder === 'asc'
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1;
    });
  }, [users, searchTerm, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const formatLastSeen = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const stats: Stats = {
    totalUsers: users.length,
    chatbotUsers: users.filter((u) => u.chatbotCreated).length,
    noChatbotUsers: users.filter((u) => !u.chatbotCreated).length,
  };

  if (isLoading) return <div className="p-10 text-center text-gray-500">Loading users...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <h1 className="ml-4 text-2xl font-bold text-gray-900">Admin WebsiteChat</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  localStorage.removeItem("isLoggedIn");
                  router.push("/signin");
                }}
                className="text-sm text-gray-500 hover:text-orange-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard icon={<User className="w-6 h-6 text-blue-600" />} label="Total Users" value={stats.totalUsers} bg="blue" />
          <StatCard icon={<Bot className="w-6 h-6 text-green-600" />} label="With Chatbot" value={stats.chatbotUsers} bg="green" />
          <StatCard icon={<UserX className="w-6 h-6 text-orange-600" />} label="No Chatbot" value={stats.noChatbotUsers} bg="orange" />
        </div>

        {/* User Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Search */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent w-full sm:w-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <span className="text-sm text-gray-500">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedUsers.length)} of {filteredAndSortedUsers.length}
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['name', 'email', 'chatbotCreated'].map((field) => (
                    <th
                      key={field}
                      onClick={() => handleSort(field as SortField)}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center space-x-1">
                        <span>
                          {{
                            name: 'User Name',
                            email: 'Email',
                            chatbotCreated: 'Chatbot Status',
                            lastSeen: 'Last Seen'
                          }[field as SortField]}
                        </span>
                        {sortBy === field && (
                          <span className="text-orange-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {user.name.split(' ').map((n) => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4 text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                      <div className='flex items-center min-h-4'>
                        <Mail className="w-4 h-4 text-gray-400 mr-2" /> {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.chatbotCreated ? (
                        <div className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 flex items-center">
                          <UserCheck className="w-4 h-4 mr-1" /> Created
                        </div>
                      ) : (
                        <div className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 flex items-center">
                          <UserX className="w-4 h-4 mr-1" /> Not Created
                        </div>
                      )}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatLastSeen(user.lastSeen)}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

// Simple stat card reusable component
const StatCard = ({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: number; bg: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div className="flex items-center">
      <div className={`p-2 bg-${bg}-100 rounded-lg`}>{icon}</div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

// Pagination component
const PaginationControls = ({ currentPage, totalPages, setCurrentPage }: { currentPage: number, totalPages: number, setCurrentPage: (page: number) => void }) => (
  <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
    <div className="flex items-center justify-between">
      <div className="flex-1 flex justify-between sm:hidden">
        <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-4 py-2 border text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
        <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="ml-3 px-4 py-2 border text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Next</button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div className="flex space-x-1">
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-2 py-1 border text-gray-500 hover:bg-gray-50 disabled:opacity-50">
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="px-2 py-1 border text-gray-500 hover:bg-gray-50 disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-2 py-1 border text-gray-500 hover:bg-gray-50 disabled:opacity-50">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="px-2 py-1 border text-gray-500 hover:bg-gray-50 disabled:opacity-50">
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
