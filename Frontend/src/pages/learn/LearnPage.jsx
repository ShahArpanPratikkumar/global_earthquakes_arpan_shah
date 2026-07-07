import { useState } from 'react';
import { LEARN_TOPICS } from '../../data/learnContent';

export default function LearnPage() {
  const [activeId, setActiveId] = useState('what-is-earthquake');
  const active = LEARN_TOPICS.find((t) => t.id === activeId);

  return (
    <div className="min-h-screen bg-earth-950 text-earth-100">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-10 text-center">
        <span className="text-5xl mb-4 block">📚</span>
        <h1 className="section-title text-earth-100 mb-3">Earthquake Learn Center</h1>
        <p className="section-subtitle max-w-2xl mx-auto">
          Explore the science of earthquakes — from tectonic plates to tsunami formation, magnitude scales, and disaster preparedness.
        </p>
      </div>

      {/* Content grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20 flex flex-col lg:flex-row gap-8">
        {/* Topic sidebar */}
        <nav className="lg:w-72 flex-shrink-0">
          <div className="earth-glass-dark rounded-2xl border border-earth-700/40 overflow-hidden sticky top-24">
            <p className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-earth-500 border-b border-earth-700/40">
              Topics
            </p>
            {LEARN_TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setActiveId(topic.id)}
                className={`w-full text-left px-5 py-3.5 flex items-center gap-3 transition-all border-b border-earth-800/30 last:border-0
                  ${activeId === topic.id
                    ? 'bg-earth-600/30 text-earth-100'
                    : 'text-earth-400 hover:bg-earth-800/30 hover:text-earth-200'
                  }`}
              >
                <span className="text-xl flex-shrink-0">{topic.icon}</span>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold truncate">{topic.title}</p>
                  <p className="text-[10px] text-earth-500 truncate">{topic.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </nav>

        {/* Main content */}
        {active && (
          <main className="flex-1 min-w-0">
            {/* Hero block */}
            <div className="earth-glass-dark rounded-2xl border border-earth-700/40 p-8 mb-6">
              <div className="flex items-start gap-5 mb-6">
                <div className="text-5xl flex-shrink-0">{active.icon}</div>
                <div>
                  <h2 className="font-display text-3xl font-bold text-earth-100 mb-1">{active.title}</h2>
                  <p className="text-earth-400 text-sm">{active.subtitle}</p>
                </div>
              </div>
              <p className="text-earth-300 text-base leading-relaxed">{active.description}</p>
            </div>

            {/* Key facts */}
            <div className="earth-glass-dark rounded-2xl border border-earth-700/40 p-6 mb-6">
              <h3 className="font-display font-bold text-earth-200 text-lg mb-4 flex items-center gap-2">
                ⚡ Key Facts
              </h3>
              <div className="space-y-3">
                {active.facts.map((fact, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-earth-600/40 border border-earth-600/60 text-earth-300 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                      {i + 1}
                    </div>
                    <p className="text-earth-300 text-sm leading-relaxed">{fact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between gap-4">
              {LEARN_TOPICS.findIndex((t) => t.id === activeId) > 0 && (() => {
                const prev = LEARN_TOPICS[LEARN_TOPICS.findIndex((t) => t.id === activeId) - 1];
                return (
                  <button onClick={() => setActiveId(prev.id)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border border-earth-700/60 text-earth-400 hover:text-earth-200 hover:border-earth-500 transition-all text-sm">
                    ← {prev.icon} {prev.title}
                  </button>
                );
              })()}
              {LEARN_TOPICS.findIndex((t) => t.id === activeId) < LEARN_TOPICS.length - 1 && (() => {
                const next = LEARN_TOPICS[LEARN_TOPICS.findIndex((t) => t.id === activeId) + 1];
                return (
                  <button onClick={() => setActiveId(next.id)}
                    className="ml-auto flex items-center gap-2 px-4 py-3 rounded-xl border border-earth-700/60 text-earth-400 hover:text-earth-200 hover:border-earth-500 transition-all text-sm">
                    {next.icon} {next.title} →
                  </button>
                );
              })()}
            </div>
          </main>
        )}
      </div>

      {/* All topics quick nav */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="divider-earth mb-10" />
        <h3 className="font-display font-bold text-earth-300 text-xl mb-6 text-center">All Topics</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {LEARN_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => { setActiveId(topic.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`text-left p-4 rounded-2xl border transition-all group
                ${activeId === topic.id
                  ? 'border-earth-500/60 bg-earth-700/20'
                  : 'border-earth-700/40 hover:border-earth-600/50 bg-earth-900/30 hover:bg-earth-800/30'
                }`}
            >
              <span className="text-2xl mb-2 block">{topic.icon}</span>
              <h4 className="font-semibold text-earth-200 text-sm group-hover:text-earth-100 transition-colors">{topic.title}</h4>
              <p className="text-earth-500 text-xs mt-0.5">{topic.subtitle}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
