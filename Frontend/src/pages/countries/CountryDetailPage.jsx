import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCountryDetail, setDetailPage } from '../../store/slices/countrySlice';
import { getRiskColor, getMagnitudeLabel } from '../../utils/riskCalculator';

export default function CountryDetailPage() {
  const { country } = useParams();
  const dispatch    = useDispatch();
  const { detail, detailMeta, detailLoading, detailError, detailPage } = useSelector((s) => s.country);

  const decodedCountry = decodeURIComponent(country);

  useEffect(() => {
    dispatch(fetchCountryDetail({ country: decodedCountry, page: detailPage, limit: 15 }));
  }, [dispatch, decodedCountry, detailPage]);

  const totalPages = Math.ceil((detailMeta?.total || 0) / 15);

  // Compute stats from loaded detail
  const mags    = detail.map((e) => parseFloat(e.mag)).filter(Boolean);
  const maxMag  = mags.length ? Math.max(...mags) : 0;
  const avgMag  = mags.length ? mags.reduce((a, b) => a + b, 0) / mags.length : 0;
  const depths  = detail.map((e) => parseFloat(e.depth)).filter(Boolean);
  const avgDepth = depths.length ? depths.reduce((a, b) => a + b, 0) / depths.length : 0;

  return (
    <div className="min-h-screen bg-earth-950 text-earth-100">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-6">
        <Link to="/countries" className="text-earth-500 hover:text-earth-300 text-sm transition-colors mb-4 inline-block">
          ← Back to Countries
        </Link>
        <h1 className="section-title text-earth-100 mb-1">🌍 {decodedCountry}</h1>
        <p className="section-subtitle">
          {detailMeta?.total?.toLocaleString() || '...'} recorded seismic events
        </p>
      </div>

      {/* Stats bar */}
      {!detailLoading && detail.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Events',     value: detailMeta?.total?.toLocaleString() || '—',     icon: '📋' },
              { label: 'Avg Magnitude',    value: `M ${avgMag.toFixed(2)}`,                        icon: '📊' },
              { label: 'Max Recorded',     value: `M ${maxMag.toFixed(1)}`,                        icon: '⚡' },
              { label: 'Avg Depth',        value: `${avgDepth.toFixed(0)} km`,                     icon: '⬇️' },
            ].map((s) => (
              <div key={s.label} className="earth-glass-dark rounded-2xl p-4 border border-earth-700/40 text-center">
                <span className="text-2xl mb-1 block">{s.icon}</span>
                <p className="font-display font-bold text-xl text-earth-100">{s.value}</p>
                <p className="text-earth-500 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {detailError && (
        <div className="max-w-6xl mx-auto px-6 mb-6">
          <div className="rounded-2xl bg-red-900/20 border border-red-800 p-4 text-red-400 text-sm">
            ⚠️ {detailError}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="earth-glass-dark rounded-2xl border border-earth-700/40 overflow-hidden">
          {detailLoading ? (
            <div className="p-8 space-y-3">
              {Array(8).fill(0).map((_, i) => <div key={i} className="skeleton h-10 rounded-xl" />)}
            </div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead className="border-b border-earth-700/60">
                  <tr className="text-earth-400 text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 text-left">Magnitude</th>
                    <th className="px-4 py-3 text-left">Location</th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">Depth</th>
                    <th className="px-4 py-3 text-left hidden lg:table-cell">Network</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.map((eq) => (
                    <tr key={eq._id}
                      className="border-b border-earth-800/30 last:border-0 hover:bg-earth-800/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-display" style={{ color: getRiskColor(eq.mag) }}>
                            M {parseFloat(eq.mag).toFixed(1)}
                          </span>
                          <span className="text-xs text-earth-500 hidden lg:inline">{getMagnitudeLabel(eq.mag)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-earth-300 truncate max-w-xs">{eq.place || '—'}</td>
                      <td className="px-4 py-3 text-earth-400 hidden md:table-cell">{eq.depth} km</td>
                      <td className="px-4 py-3 text-earth-500 hidden lg:table-cell uppercase text-xs">{eq.net}</td>
                      <td className="px-4 py-3 text-earth-500 text-xs">{new Date(eq.time).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <Link to={`/earthquake/${eq._id}`}
                          className="text-earth-400 hover:text-earth-200 transition-colors text-xs">
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-earth-700/60">
                  <span className="text-earth-500 text-xs">
                    Page {detailPage} of {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={detailPage <= 1}
                      onClick={() => dispatch(setDetailPage(detailPage - 1))}
                      className="px-3 py-1.5 rounded-lg text-xs text-earth-400 border border-earth-700 hover:border-earth-500 hover:text-earth-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                      ← Prev
                    </button>
                    <button
                      disabled={detailPage >= totalPages}
                      onClick={() => dispatch(setDetailPage(detailPage + 1))}
                      className="px-3 py-1.5 rounded-lg text-xs text-earth-400 border border-earth-700 hover:border-earth-500 hover:text-earth-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
