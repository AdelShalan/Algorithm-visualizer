import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '../data/algorithms';
import {
  BarChart3, Search, Network, Table, GitBranch, Hash,
  CornerDownLeft, Split, Type, Move, ChevronDown, ChevronRight
} from 'lucide-react';

const iconMap = {
  'bar-chart-3': BarChart3,
  'search': Search,
  'network': Network,
  'table': Table,
  'git-branch': GitBranch,
  'hash': Hash,
  'corner-down-left': CornerDownLeft,
  'split': Split,
  'type': Type,
  'move': Move,
};

const categoryColors = [
  { iconBg: 'bg-blue-600', iconBgLight: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', activeBg: 'bg-blue-50', activeText: 'text-blue-700', activeAccent: 'bg-blue-500' },
  { iconBg: 'bg-emerald-600', iconBgLight: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', activeBg: 'bg-emerald-50', activeText: 'text-emerald-700', activeAccent: 'bg-emerald-500' },
  { iconBg: 'bg-violet-600', iconBgLight: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-500', activeBg: 'bg-violet-50', activeText: 'text-violet-700', activeAccent: 'bg-violet-500' },
  { iconBg: 'bg-amber-600', iconBgLight: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', activeBg: 'bg-amber-50', activeText: 'text-amber-700', activeAccent: 'bg-amber-500' },
  { iconBg: 'bg-rose-600', iconBgLight: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500', activeBg: 'bg-rose-50', activeText: 'text-rose-700', activeAccent: 'bg-rose-500' },
  { iconBg: 'bg-cyan-600', iconBgLight: 'bg-cyan-50', text: 'text-cyan-700', dot: 'bg-cyan-500', activeBg: 'bg-cyan-50', activeText: 'text-cyan-700', activeAccent: 'bg-cyan-500' },
  { iconBg: 'bg-orange-600', iconBgLight: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500', activeBg: 'bg-orange-50', activeText: 'text-orange-700', activeAccent: 'bg-orange-500' },
  { iconBg: 'bg-indigo-600', iconBgLight: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-500', activeBg: 'bg-indigo-50', activeText: 'text-indigo-700', activeAccent: 'bg-indigo-500' },
  { iconBg: 'bg-pink-600', iconBgLight: 'bg-pink-50', text: 'text-pink-700', dot: 'bg-pink-500', activeBg: 'bg-pink-50', activeText: 'text-pink-700', activeAccent: 'bg-pink-500' },
  { iconBg: 'bg-teal-600', iconBgLight: 'bg-teal-50', text: 'text-teal-700', dot: 'bg-teal-500', activeBg: 'bg-teal-50', activeText: 'text-teal-700', activeAccent: 'bg-teal-500' },
];

export default function Sidebar() {
  const location = useLocation();
  const [expandedCategories, setExpandedCategories] = useState(new Set(['sorting']));

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const isActive = (categoryId, algorithmId) =>
    location.pathname === `/${categoryId}/${algorithmId}`;

  const totalAlgorithms = categories.reduce((sum, c) => sum + c.algorithms.length, 0);

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-gray-800 transition-colors">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-none">AlgoViz</h1>
            <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase mt-0.5">Visualizer</p>
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="px-3 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search algorithms..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
        {categories.map((category, idx) => {
          const Icon = iconMap[category.icon];
          const isExpanded = expandedCategories.has(category.id);
          const colors = categoryColors[idx];
          const hasActiveAlgo = category.algorithms.some(algo => isActive(category.id, algo.id));

          return (
            <div key={category.id}>
              <button
                onClick={() => toggleCategory(category.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                  hasActiveAlgo
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  hasActiveAlgo ? colors.iconBg : 'bg-gray-100'
                }`}>
                  <Icon className={`w-3.5 h-3.5 ${hasActiveAlgo ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <span className="flex-1 text-left text-[13px]">{category.name}</span>
                <span className={`text-[11px] font-semibold tabular-nums ${hasActiveAlgo ? 'text-gray-600' : 'text-gray-400'}`}>
                  {category.algorithms.length}
                </span>
                {isExpanded
                  ? <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  : <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                }
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pl-3 pr-1 pt-0.5 pb-1 space-y-0.5">
                      {category.algorithms.map(algo => {
                        const active = isActive(category.id, algo.id);
                        return (
                          <Link
                            key={algo.id}
                            to={`/${category.id}/${algo.id}`}
                            className={`relative flex items-center gap-2 pl-4 pr-3 py-1.5 rounded-lg text-[13px] transition-all duration-150 ${
                              active
                                ? `${colors.activeBg} ${colors.activeText} font-semibold`
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                            }`}
                          >
                            {active && (
                              <span className={`absolute left-1.5 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full ${colors.activeAccent}`} />
                            )}
                            <span className="truncate">{algo.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-xs text-gray-500 font-medium">{totalAlgorithms} algorithms</span>
        </div>
      </div>
    </aside>
  );
}
