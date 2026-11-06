'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Truck,
  Plus,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Mail,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BUSINESS_INFO } from '@/lib/constants/business';
import type { PlatformDatabaseState } from '@/lib/db/platform-store';

export default function AdminResourcesFleetAndTeamsPage() {
  const [db, setDb] = useState<PlatformDatabaseState | null>(null);
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('MOVER');
  const [empPhone, setEmpPhone] = useState('(587) 999-9565');
  const [empEmail, setEmpEmail] = useState('');

  const [vehName, setVehName] = useState('');
  const [vehType, setVehType] = useState('26FT_BOX_TRUCK');
  const [vehPlate, setVehPlate] = useState('');
  const [vehCapacity, setVehCapacity] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = async () => {
    const res = await fetch('/api/admin/platform');
    const json = await res.json();
    if (json.ok && json.data) {
      setDb(json.data);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!db) {
    return (
      <div className="rounded-3xl border border-brand-navy/10 bg-white p-12 text-center text-sm font-bold text-brand-navy">
        Loading Employees, Teams &amp; Fleet Vehicles...
      </div>
    );
  }

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim()) return;
    setFeedback(null);
    const res = await fetch('/api/admin/platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'CREATE_EMPLOYEE',
        fullName: empName,
        role: empRole,
        phone: empPhone,
        email: empEmail || BUSINESS_INFO.email,
      }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setEmpName('');
      setEmpEmail('');
      setFeedback(`Added employee ${data.employee.fullName}.`);
      await loadData();
    } else {
      setFeedback(data.error || 'Unable to add employee.');
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehName.trim()) return;
    setFeedback(null);
    const res = await fetch('/api/admin/platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'CREATE_VEHICLE',
        name: vehName,
        vehicleType: vehType,
        licensePlate: vehPlate || 'AB-QMS-NEW',
        capacitySummary: vehCapacity || 'Equipped Moving & Junk Removal Truck',
      }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setVehName('');
      setVehPlate('');
      setVehCapacity('');
      setFeedback(`Added fleet vehicle ${data.vehicle.name}.`);
      await loadData();
    } else {
      setFeedback(data.error || 'Unable to add vehicle.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <Badge variant="orange" className="mb-2">
          Section 8.7 • Operational Resources
        </Badge>
        <h1 className="font-heading text-2xl font-extrabold text-brand-navy sm:text-3xl">
          Employees, Crew Teams &amp; Fleet Vehicles
        </h1>
        <p className="mt-1 text-sm text-brand-muted">
          Manage field movers, junk removal specialists, dispatch teams, and equipped moving &amp;
          cleanout trucks.
        </p>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Active Crew Teams */}
      <div className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-brand-navy">
          <ShieldCheck className="h-5 w-5 text-brand-orange" />
          <h2 className="font-heading text-lg font-extrabold">
            Active Dispatch Teams ({db.teams.length})
          </h2>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {db.teams.map((team) => {
            const members = db.employees.filter((e) => team.memberIds.includes(e.id));
            return (
              <div
                key={team.id}
                className="rounded-2xl border border-brand-navy/10 bg-brand-light/50 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-brand-orange">
                    {team.code}
                  </span>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                    {team.status}
                  </span>
                </div>
                <h3 className="mt-2 font-heading text-base font-extrabold text-brand-navy">
                  {team.name}
                </h3>
                <p className="mt-1 text-xs text-brand-muted">Specialty: {team.specialty}</p>
                <div className="mt-3 border-t border-brand-navy/10 pt-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">
                    Assigned Crew ({members.length}):
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {members.map((m) => (
                      <span
                        key={m.id}
                        className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-brand-navy shadow-sm"
                      >
                        {m.fullName}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Employees & Add Employee Form */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm lg:col-span-8">
          <div className="flex items-center gap-2 text-brand-navy">
            <Users className="h-5 w-5 text-brand-orange" />
            <h2 className="font-heading text-lg font-extrabold">
              Staff &amp; Crew Directory ({db.employees.length})
            </h2>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {db.employees.map((emp) => (
              <div
                key={emp.id}
                className="rounded-2xl border border-brand-navy/10 bg-brand-light/40 p-4 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-brand-navy px-2.5 py-0.5 text-[10px] font-bold text-white">
                    {emp.role}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700">{emp.status}</span>
                </div>
                <p className="mt-2 font-heading text-sm font-extrabold text-brand-navy">
                  {emp.fullName}
                </p>
                <p className="mt-1 text-brand-muted">
                  <Phone className="inline h-3 w-3 mr-1 text-brand-orange" />
                  {emp.phone} • <Mail className="inline h-3 w-3 mx-1 text-brand-orange" />
                  {emp.email}
                </p>
                <p className="mt-1.5 text-[11px] text-brand-charcoal">
                  <strong>Skills:</strong> {emp.skills.join(', ')}
                </p>
                <p className="mt-0.5 text-[11px] text-brand-muted">{emp.availabilityNote}</p>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleAddEmployee}
          className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm lg:col-span-4 space-y-4"
        >
          <h3 className="font-heading text-base font-extrabold text-brand-navy">
            + Add New Crew / Staff Member
          </h3>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={empName}
              onChange={(e) => setEmpName(e.target.value)}
              placeholder="e.g., Jordan Mak"
              className="mt-1 w-full rounded-xl border border-brand-navy/15 px-3.5 py-2.5 text-xs text-brand-navy"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
              Operational Role
            </label>
            <select
              value={empRole}
              onChange={(e) => setEmpRole(e.target.value)}
              className="mt-1 w-full rounded-xl border border-brand-navy/15 bg-white px-3.5 py-2.5 text-xs font-bold text-brand-navy"
            >
              <option value="MOVER">Mover / Relocation Specialist</option>
              <option value="TEAM_LEAD">Crew Team Lead</option>
              <option value="JUNK_SPECIALIST">Junk Removal Specialist</option>
              <option value="DRIVER">Commercial Truck Driver</option>
              <option value="COORDINATOR">Dispatch Coordinator</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
              Phone Number
            </label>
            <input
              type="text"
              value={empPhone}
              onChange={(e) => setEmpPhone(e.target.value)}
              className="mt-1 w-full rounded-xl border border-brand-navy/15 px-3.5 py-2.5 text-xs text-brand-navy"
            />
          </div>
          <Button type="submit" variant="primary" size="md" fullWidth>
            <Plus className="mr-1.5 h-4 w-4" />
            Add Staff Member
          </Button>
        </form>
      </div>

      {/* Fleet Vehicles & Add Vehicle Form */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm lg:col-span-8">
          <div className="flex items-center gap-2 text-brand-navy">
            <Truck className="h-5 w-5 text-brand-orange" />
            <h2 className="font-heading text-lg font-extrabold">
              Fleet Vehicles &amp; Capacity ({db.vehicles.length})
            </h2>
          </div>

          <div className="mt-4 space-y-3">
            {db.vehicles.map((veh) => (
              <div
                key={veh.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-brand-navy/10 bg-brand-light/40 p-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-brand-orange">
                      {veh.licensePlate}
                    </span>
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      {veh.status}
                    </span>
                  </div>
                  <p className="mt-1 font-heading text-sm font-extrabold text-brand-navy">
                    {veh.name}
                  </p>
                  <p className="mt-0.5 text-brand-charcoal">{veh.capacitySummary}</p>
                  <p className="mt-0.5 text-[11px] text-brand-muted">{veh.maintenanceNote}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleAddVehicle}
          className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm lg:col-span-4 space-y-4"
        >
          <h3 className="font-heading text-base font-extrabold text-brand-navy">
            + Register Fleet Truck
          </h3>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
              Unit Name *
            </label>
            <input
              type="text"
              required
              value={vehName}
              onChange={(e) => setVehName(e.target.value)}
              placeholder="e.g., Unit #04 — 26ft Highway Corridor Box Truck"
              className="mt-1 w-full rounded-xl border border-brand-navy/15 px-3.5 py-2.5 text-xs text-brand-navy"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
              Truck Type
            </label>
            <select
              value={vehType}
              onChange={(e) => setVehType(e.target.value)}
              className="mt-1 w-full rounded-xl border border-brand-navy/15 bg-white px-3.5 py-2.5 text-xs font-bold text-brand-navy"
            >
              <option value="26FT_BOX_TRUCK">26ft Box Truck (Liftgate)</option>
              <option value="20FT_MOVING_TRUCK">20ft Urban Moving Truck</option>
              <option value="16FT_JUNK_DUMP_TRUCK">16ft High-Wall Junk Removal Truck</option>
              <option value="CARGO_SPRINTER">Commercial Delivery Sprinter Van</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
              Alberta License Plate
            </label>
            <input
              type="text"
              value={vehPlate}
              onChange={(e) => setVehPlate(e.target.value)}
              placeholder="AB-QMS-104"
              className="mt-1 w-full rounded-xl border border-brand-navy/15 px-3.5 py-2.5 text-xs text-brand-navy"
            />
          </div>
          <Button type="submit" variant="primary" size="md" fullWidth>
            <Plus className="mr-1.5 h-4 w-4" />
            Add Fleet Vehicle
          </Button>
        </form>
      </div>
    </div>
  );
}

