'use client';

import React, { useState } from 'react';
import { Search, Phone, Calendar, Clock, CheckCircle2, XCircle, MessageCircle, Filter } from 'lucide-react';
import type { Appointment } from '@/types/database';

interface AdminAppointmentsProps {
  appointments: Appointment[];
  onUpdateStatus: (id: string, status: 'pending' | 'confirmed' | 'cancelled') => Promise<void>;
}

export function AdminAppointments({ appointments, onUpdateStatus }: AdminAppointmentsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patient_phone.includes(searchTerm) ||
      apt.chamber_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'pending'
        ? !apt.status || apt.status === 'pending'
        : apt.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    setUpdatingId(id);
    try {
      await onUpdateStatus(id, newStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-2xl text-[#062F31]">Patient Appointments</h2>
          <p className="text-xs text-[#062F31]/60">Manage appointment submissions and communicate directly with patients</p>
        </div>

        {/* Counts summary */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            {appointments.filter((a) => !a.status || a.status === 'pending').length} Pending
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {appointments.filter((a) => a.status === 'confirmed').length} Confirmed
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#0B6E73]/15 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patient name, phone, chamber..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-1" />
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-[#0B6E73] text-white shadow-sm'
                  : 'bg-gray-50 text-[#062F31]/70 hover:bg-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-2xl border border-[#0B6E73]/15 overflow-hidden shadow-sm">
        {filteredAppointments.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">
            No patient appointments found matching the current search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EEF7F6]/80 text-[#062F31] font-bold border-b border-[#0B6E73]/10 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Patient</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Chamber</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Clinical Problem</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[#062F31]">
                {filteredAppointments.map((apt) => {
                  const currentStatus = apt.status || 'pending';
                  const isPending = currentStatus === 'pending';
                  const isConfirmed = currentStatus === 'confirmed';
                  const isUpdating = updatingId === apt.id;

                  return (
                    <tr key={apt.id || apt.patient_phone} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-4 font-semibold text-sm">
                        {apt.patient_name}
                      </td>
                      <td className="py-4 px-4 font-mono font-medium text-[#0B6E73]">
                        <a href={`tel:${apt.patient_phone}`} className="hover:underline flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{apt.patient_phone}</span>
                        </a>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium">{apt.chamber_name}</span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span>{apt.preferred_date}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 max-w-xs">
                        <p className="line-clamp-2 text-gray-600 italic">
                          {apt.problem_summary || 'General Consultation'}
                        </p>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <select
                          value={currentStatus}
                          disabled={isUpdating || !apt.id}
                          onChange={(e) =>
                            handleStatusChange(apt.id!, e.target.value as 'pending' | 'confirmed' | 'cancelled')
                          }
                          className={`text-xs font-semibold py-1 px-2.5 rounded-lg border focus:outline-none cursor-pointer ${
                            isPending
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : isConfirmed
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-gray-100 text-gray-700 border-gray-200'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`https://wa.me/88${apt.patient_phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Hello ${apt.patient_name}, this is from the office of Dr. Kollol regarding your appointment request for ${apt.preferred_date} at ${apt.chamber_name}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all title='WhatsApp Message'"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
