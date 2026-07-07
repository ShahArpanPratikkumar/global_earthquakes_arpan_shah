import { useState } from 'react';
import { NGO_DATA, NGO_CATEGORIES } from '../../data/ngos';

export default function NgosPage() {
  const [category, setCategory]   = useState('All');
  const [search,   setSearch]     = useState('');

  const filtered = NGO_DATA.filter((ngo) => {
    const matchCat    = category === 'All' || ngo.category === category;
    const matchSearch = [ngo.name, ngo.shortName, ngo.country, ngo.mission]
      .some((f) => f.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-earth-950 text-earth-100">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-8 text-center">
        <span className="text-5xl mb-4 block">🤝</span>
        <h1 className="section-title text-earth-100 mb-3">NGO Directory</h1>
        <p className="section-subtitle max-w-2xl mx-auto">
          {NGO_DATA.length} global organisations working in earthquake relief, disaster response, environmental protection, and community resilience
        </p>
      </div>

      {/* Controls */}
      <div className="max-w-6xl mx-auto px-6 mb-8 space-y-4">
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-500 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organisations…"
            className="earth-input pl-9 bg-earth-900 border-earth-700 text-earth-100 placeholder-earth-600 w-full"
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 justify-center">
          {NGO_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                category === cat
                  ? 'bg-earth-500/40 text-earth-200 border border-earth-500/60'
                  : 'text-earth-500 border border-earth-700/50 hover:text-earth-300 hover:border-earth-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="max-w-6xl mx-auto px-6 mb-4">
        <p className="text-earth-500 text-sm">
          Showing <span className="text-earth-300 font-semibold">{filtered.length}</span> organisations
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-earth-500">No organisations match your search</p>
            <button onClick={() => { setSearch(''); setCategory('All'); }}
              className="mt-4 text-earth-400 hover:text-earth-200 text-sm transition-colors">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((ngo) => (
              <div key={ngo.id}
                className="earth-glass-dark rounded-2xl p-5 border border-earth-700/30 hover:border-earth-600/50 transition-all group flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{ngo.emoji}</span>
                    <div>
                      <h3 className="font-display font-bold text-earth-100 text-sm leading-tight group-hover:text-earth-200 transition-colors">
                        {ngo.name}
                      </h3>
                      <p className="text-earth-500 text-[10px]">{ngo.shortName} · {ngo.country}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-earth-800/60 text-earth-400 border-earth-600/40 whitespace-nowrap">
                    {ngo.category}
                  </span>
                </div>

                {/* Mission */}
                <p className="text-earth-400 text-xs leading-relaxed flex-1 mb-4 line-clamp-3">
                  {ngo.mission}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {ngo.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-earth-700/40 text-earth-400 border border-earth-700/40">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-earth-700/30">
                  <div className="flex gap-3 text-[10px] text-earth-500">
                    <span>Founded {ngo.founded}</span>
                    <span>·</span>
                    <span>{ngo.volunteers} volunteers</span>
                  </div>
                  <a
                    href={ngo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-earth-400 hover:text-earth-200 transition-colors text-xs font-semibold"
                  >
                    Visit →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-earth-900/30 border-t border-earth-800/40">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h2 className="font-display text-2xl font-bold text-earth-100 mb-3">
            Support Earthquake Relief Efforts
          </h2>
          <p className="text-earth-400 text-sm max-w-xl mx-auto mb-6">
            When earthquakes strike, these organisations are on the ground within hours. Your support — financial, volunteer, or through awareness — makes a critical difference.
          </p>
          <a href="/save-earth" className="earth-btn-primary px-6 py-3">
            🌱 Learn How to Help
          </a>
        </div>
      </div>
    </div>
  );
}
