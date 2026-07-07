export default function SaveEarthPage() {
  const stats = [
    { icon: '🌡️', value: '1.2°C',    label: 'Temperature rise since pre-industrial era' },
    { icon: '🌊', value: '20 cm',     label: 'Sea level rise in the past century' },
    { icon: '🌲', value: '10M acres', label: 'Forest lost annually to deforestation' },
    { icon: '💨', value: '420 ppm',   label: 'Atmospheric CO₂ concentration (2024)' },
  ];

  const actions = [
    {
      icon: '🏗️',
      title: 'Earthquake-Resilient Construction',
      description: 'Building codes incorporating seismic-resistant design can reduce casualties by up to 90%. Advocate for stronger standards in earthquake-prone regions.',
      color: 'earth',
    },
    {
      icon: '🌿',
      title: 'Reforestation & Slope Stability',
      description: 'Tree root systems stabilise slopes, reducing earthquake-triggered landslides. Planting trees in vulnerable regions saves lives and ecosystems.',
      color: 'olive',
    },
    {
      icon: '📡',
      title: 'Early Warning Systems',
      description: 'Supporting investment in seismic monitoring networks gives communities precious seconds to minutes of warning — enough to save thousands of lives.',
      color: 'earth',
    },
    {
      icon: '💧',
      title: 'Water Infrastructure Protection',
      description: 'Earthquakes frequently rupture water infrastructure. Community water storage and earthquake-proofing of pipelines protects public health post-disaster.',
      color: 'olive',
    },
    {
      icon: '🏥',
      title: 'Community Emergency Training',
      description: 'First-aid and disaster-response training at the community level dramatically improves survival rates in the critical first hours after a major earthquake.',
      color: 'earth',
    },
    {
      icon: '🔬',
      title: 'Support Seismic Research',
      description: 'Funding seismological research leads to better hazard models, improved building codes, and the next generation of earthquake-resistant materials.',
      color: 'olive',
    },
  ];

  return (
    <div className="min-h-screen bg-earth-950 text-earth-100">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-olive-700/10 to-transparent" />
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-16 text-center relative z-10">
          <span className="text-6xl mb-5 block">🌱</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-earth-100 mb-4">
            Save The Earth
          </h1>
          <p className="text-earth-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Our planet faces twin crises: the climate emergency and the ever-present threat of seismic catastrophe. Understanding both is the first step toward resilience.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="border-y border-earth-800/40 bg-earth-900/30">
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <span className="text-3xl mb-2 block">{s.icon}</span>
              <p className="font-display text-3xl font-bold text-gradient-earth mb-1">{s.value}</p>
              <p className="text-earth-500 text-xs leading-relaxed">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* The Connection */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="section-title text-earth-100 text-center mb-4">The Climate–Earthquake Connection</h2>
        <p className="section-subtitle text-center max-w-2xl mx-auto mb-12">
          Scientific research is revealing surprising links between climate change and seismic activity
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '🧊',
              title: 'Glacial Retreat',
              desc: 'As massive ice sheets melt, the reduced surface pressure on Earth\'s crust can trigger seismic activity — a process called isostatic rebound already observed in Iceland and Greenland.',
            },
            {
              icon: '🌊',
              title: 'Rising Oceans',
              desc: 'Increasing ocean mass redistributes pressure on the oceanic crust, potentially influencing fault systems in coastal regions and increasing pore pressure in submarine faults.',
            },
            {
              icon: '🌧️',
              title: 'Extreme Rainfall',
              desc: 'Intense rainfall events have been linked to triggered seismicity — water infiltrating faults reduces friction, and the additional weight can destabilise slopes already stressed by tectonic forces.',
            },
          ].map((c) => (
            <div key={c.title} className="earth-glass-dark rounded-2xl p-6 border border-earth-700/40">
              <span className="text-3xl mb-3 block">{c.icon}</span>
              <h3 className="font-display font-bold text-earth-200 mb-2">{c.title}</h3>
              <p className="text-earth-400 text-sm leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-earth-900/30 border-y border-earth-800/40">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="section-title text-earth-100 text-center mb-3">Take Action</h2>
          <p className="section-subtitle text-center max-w-xl mx-auto mb-10">
            Individual and collective action makes a real difference in earthquake preparedness and environmental protection
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {actions.map((a) => (
              <div key={a.title} className="earth-glass-dark rounded-2xl p-5 border border-earth-700/30 hover:border-earth-600/50 transition-all">
                <span className="text-2xl mb-3 block">{a.icon}</span>
                <h3 className="font-display font-bold text-earth-200 mb-2 text-sm">{a.title}</h3>
                <p className="text-earth-500 text-xs leading-relaxed">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency kit */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="earth-glass-dark rounded-2xl border border-earth-700/40 p-8">
          <div className="flex items-start gap-5 mb-6">
            <span className="text-4xl">🎒</span>
            <div>
              <h2 className="font-display text-2xl font-bold text-earth-100 mb-1">72-Hour Emergency Kit</h2>
              <p className="text-earth-400 text-sm">Recommended contents for earthquake preparedness</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              '💧 3 litres water per person/day',
              '🥫 Non-perishable food (3-day supply)',
              '🔦 Flashlight + extra batteries',
              '🩹 First aid kit',
              '📻 Battery-powered radio',
              '🔑 Whistle (to signal for help)',
              '🧰 Dust masks & plastic sheeting',
              '📄 Copies of important documents',
              '💊 Week\'s worth of medications',
              '🔧 Wrench/pliers to turn off utilities',
              '📱 Manual can opener',
              '🗺️ Local maps',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-earth-300">
                <span className="w-1 h-1 rounded-full bg-olive-500 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-6 pb-20 text-center">
        <p className="text-earth-400 text-lg mb-6 max-w-xl mx-auto">
          Every action matters. Share this knowledge, support relief organisations, and help build a more resilient world.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a href="/ngos" className="earth-btn-primary px-6 py-3">🤝 Support NGOs</a>
          <a href="/learn" className="earth-btn-outline border-earth-600 text-earth-300 px-6 py-3">📚 Learn More</a>
        </div>
      </div>
    </div>
  );
}
