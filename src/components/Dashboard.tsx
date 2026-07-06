"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  Bell,
  Search,
  Menu,
  ChevronDown,
  LogOut,
  Plus
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-background font-sans">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold mr-3">
            C
          </div>
          <span className="text-xl font-semibold text-gray-800 tracking-tight">
            CPX Labs
          </span>
        </div>

        <nav className="flex-1 py-6">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Visão Geral" active />
          <SidebarItem icon={<Users size={20} />} label="Equipe" />
          <SidebarItem icon={<BarChart3 size={20} />} label="Relatórios" />
          <SidebarItem icon={<Settings size={20} />} label="Configurações" />
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <LogOut size={18} className="mr-3" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center flex-1 max-w-xl">
            <button className="md:hidden mr-4 text-gray-500">
              <Menu size={24} />
            </button>
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Pesquisar..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200 mx-2"></div>
            <button className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm">
                CP
              </div>
              <span className="hidden sm:inline text-sm font-medium text-gray-700">Carlos Pereira</span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Visão Geral</h1>
              <p className="text-sm text-gray-500 mt-1">Bem-vindo de volta! Aqui está o resumo do seu projeto.</p>
            </div>
            <button className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-semibold transition-colors shadow-sm shadow-brand-500/20">
              <Plus size={18} className="mr-2" />
              Novo Projeto
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard label="Projetos Ativos" value="12" change="+2" trend="up" />
            <StatCard label="Horas Trabalhadas" value="156h" change="+15%" trend="up" />
            <StatCard label="Membros no Time" value="8" change="0" trend="neutral" />
            <StatCard label="Tasks Concluídas" value="84" change="+12" trend="up" />
          </div>

          {/* Charts/Large Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 dashboard-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Desempenho Semanal</h3>
                <select className="text-xs border-gray-300 rounded focus:ring-brand-500">
                  <Last7DaysOption />
                </select>
              </div>
              <div className="h-64 flex items-end justify-between px-2">
                <Bar height="40%" />
                <Bar height="60%" />
                <Bar height="45%" />
                <Bar height="85%" />
                <Bar height="70%" />
                <Bar height="55%" />
                <Bar height="90%" active />
              </div>
              <div className="flex justify-between mt-4 px-2 text-xs text-gray-400 font-medium">
                <span>Seg</span>
                <span>Ter</span>
                <span>Qua</span>
                <span>Qui</span>
                <span>Sex</span>
                <span>Sáb</span>
                <span>Dom</span>
              </div>
            </div>

            <div className="dashboard-card">
              <h3 className="font-semibold text-gray-900 mb-6">Atividade Recente</h3>
              <div className="space-y-6">
                <ActivityItem
                  title="Novo código commitado"
                  desc="Main branch atualizada por Jules"
                  time="2h atrás"
                />
                <ActivityItem
                  title="Reunião de Design"
                  desc="Discussão sobre a nova UI"
                  time="5h atrás"
                />
                <ActivityItem
                  title="Deploy realizado"
                  desc="Ambiente de staging atualizado"
                  time="Ontem"
                  isLast
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link href="#" className={`sidebar-item ${active ? 'active' : ''}`}>
      <span className="mr-4">{icon}</span>
      {label}
    </Link>
  );
}

function StatCard({ label, value, change, trend }: { label: string, value: string, change: string, trend: 'up' | 'down' | 'neutral' }) {
  return (
    <div className="dashboard-card">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className="flex items-baseline mt-2">
        <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
        <span className={`ml-2 text-xs font-semibold ${
          trend === 'up' ? 'text-green-600' :
          trend === 'down' ? 'text-red-600' : 'text-gray-400'
        }`}>
          {change}
        </span>
      </div>
    </div>
  );
}

function Bar({ height, active = false }: { height: string, active?: boolean }) {
  return (
    <div
      className={`w-8 rounded-t-sm transition-all ${active ? 'bg-brand-500' : 'bg-brand-100 hover:bg-brand-200'}`}
      style={{ height }}
    />
  );
}

function ActivityItem({ title, desc, time, isLast = false }: { title: string, desc: string, time: string, isLast?: boolean }) {
  return (
    <div className="flex space-x-3">
      <div className="relative">
        <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5" />
        {!isLast && <div className="absolute top-4 left-1 w-px h-full bg-gray-100" />}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
        <p className="text-[10px] text-gray-400 mt-1 uppercase font-semibold tracking-wider">{time}</p>
      </div>
    </div>
  );
}

function Last7DaysOption() {
  return <option>Últimos 7 dias</option>;
}
