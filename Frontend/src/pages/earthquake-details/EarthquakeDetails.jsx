import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchEarthquakeById } from '../../store/slices/earthquakeSlice';
import { SeverityBadge, DepthBadge, Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import earthquakeService from '../../services/earthquakeService';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Compass, 
  Radio, 
  AlertTriangle,
  Activity,
  Maximize2,
  GitBranch
} from 'lucide-react';

const EarthquakeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { selectedEarthquake: eq, detailsLoading: loading, error } = useSelector((state) => state.earthquakes);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  // Determine where to go back based on navigation history
  const canGoBack = window.history.length > 1;

  useEffect(() => {
    dispatch(fetchEarthquakeById(id));
  }, [dispatch, id]);

  // Fetch related events based on location region
  useEffect(() => {
    if (!eq) return;

    const fetchRelated = async () => {
      setRelatedLoading(true);
      try {
        // Extract country/region name from place (e.g. "25km SE of Tokyo, Japan" -> "Japan")
        const placeParts = eq.place.split(',');
        const region = placeParts[placeParts.length - 1]?.trim() || eq.place;
        
        const response = await earthquakeService.getAll({ 
          place: region, 
          limit: 4 
        });
        
        // Filter out current earthquake
        const filtered = (response.data || []).filter(item => item.id !== eq.id);
        setRelatedEvents(filtered);
      } catch (err) {
        console.warn('Failed to load related earthquakes', err);
      } finally {
        setRelatedLoading(false);
      }
    };

    fetchRelated();
  }, [eq]);

  const handleBack = () => {
    if (canGoBack) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <>
      <Helmet>
        <title>{eq ? `M ${eq.mag} - ${eq.place}` : 'Earthquake Details'} | Global Earthquake Analytics</title>
        <meta name="description" content={eq ? `Detailed reports for seismic incident ${eq.id} in ${eq.place} with magnitude ${eq.mag} and depth ${eq.depth}km.` : 'Detailed reports for seismic incident.'} />
      </Helmet>

      <div className="space-y-6">
        {/* Back Navigation Bar */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm font-semibold text-earth-500 hover:text-earth-800 dark:text-earth-400 dark:hover:text-earth-100 transition-colors px-3 py-1.5 rounded-xl hover:bg-earth-100 dark:hover:bg-earth-800"
        >
          <ArrowLeft size={16} />
          <span>← Go Back</span>
        </button>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        ) : error || !eq ? (
          <div className="p-12 text-center flex flex-col items-center justify-center border border-rose-500/20 bg-rose-500/5 rounded-2xl">
            <p className="text-red-500 font-semibold mb-4">Error loading earthquake details: {error || 'Record not found'}</p>
            <button 
              onClick={() => dispatch(fetchEarthquakeById(id))}
              className="flex items-center space-x-2 text-sm bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Retry Load
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            
            {/* Left Hand: Core Details Panel */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Event Header Banner */}
              <Card className="border border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-r from-slate-900/10 to-transparent">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <SeverityBadge mag={eq.mag} />
                      <DepthBadge depth={eq.depth} />
                      <Badge variant="info" className="uppercase font-mono text-[10px]">
                        {eq.status}
                      </Badge>
                    </div>
                    
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white font-outfit mt-2">
                      {eq.place}
                    </h2>
                    
                    <p className="text-xs text-slate-400 font-mono">Event Reference Code: {eq.id}</p>
                  </div>
                  
                  {/* Huge Magnitude Indicator */}
                  <div className="flex flex-col items-center justify-center bg-slate-900/90 text-white rounded-2xl p-4 border border-slate-800 shadow-xl min-w-[90px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mag</span>
                    <span className="text-3xl font-extrabold text-primary-400 font-outfit">{eq.mag.toFixed(1)}</span>
                    <span className="text-[10px] font-semibold text-slate-500">{eq.magType?.toUpperCase()}</span>
                  </div>
                </div>
              </Card>

              {/* Technical Specifications Grid */}
              <Card className="border border-slate-200/50 dark:border-slate-800/50">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                  Technical Specifications
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  
                  {/* Geographic Coordinates */}
                  <div className="flex items-start space-x-3">
                    <Compass className="text-primary-500 mt-0.5 shrink-0" size={18} />
                    <div className="space-y-0.5">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Coordinates</p>
                      <p className="text-sm font-bold">{eq.latitude.toFixed(4)}° N</p>
                      <p className="text-sm font-bold">{eq.longitude.toFixed(4)}° E</p>
                    </div>
                  </div>

                  {/* Occurrence Time */}
                  <div className="flex items-start space-x-3">
                    <Clock className="text-primary-500 mt-0.5 shrink-0" size={18} />
                    <div className="space-y-0.5">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Time</p>
                      <p className="text-sm font-bold">{new Date(eq.time).toLocaleDateString()}</p>
                      <p className="text-sm font-bold">{new Date(eq.time).toLocaleTimeString()}</p>
                    </div>
                  </div>

                  {/* Reporting Network */}
                  <div className="flex items-start space-x-3">
                    <Radio className="text-primary-500 mt-0.5 shrink-0" size={18} />
                    <div className="space-y-0.5">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Network Source</p>
                      <p className="text-sm font-bold uppercase">{eq.net} Network</p>
                      <p className="text-xs text-slate-400 font-mono">Source: {eq.locationSource || 'USGS'}</p>
                    </div>
                  </div>

                  {/* Magnitude Error / Stations */}
                  <div className="flex items-start space-x-3 border-t sm:border-t-0 pt-4 sm:pt-0">
                    <Activity className="text-cyan-500 mt-0.5 shrink-0" size={18} />
                    <div className="space-y-0.5">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Quality Fit</p>
                      <p className="text-sm font-bold">RMS: {eq.rms ?? 'N/A'}</p>
                      <p className="text-xs text-slate-400">Stations (NST): {eq.nst ?? 'N/A'}</p>
                    </div>
                  </div>

                  {/* Gap & Location Error */}
                  <div className="flex items-start space-x-3 border-t pt-4 sm:pt-0">
                    <Maximize2 className="text-cyan-500 mt-0.5 shrink-0" size={18} />
                    <div className="space-y-0.5">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Azymuthal Gap</p>
                      <p className="text-sm font-bold">Gap: {eq.gap ? `${eq.gap}°` : 'N/A'}</p>
                      <p className="text-xs text-slate-400">Min Distance (Dmin): {eq.dmin ?? 'N/A'}</p>
                    </div>
                  </div>

                  {/* Error Margin Estimates */}
                  <div className="flex items-start space-x-3 border-t pt-4 sm:pt-0">
                    <GitBranch className="text-cyan-500 mt-0.5 shrink-0" size={18} />
                    <div className="space-y-0.5">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Error Bounds</p>
                      <p className="text-sm font-bold">Horiz: ±{eq.horizontalError ? `${eq.horizontalError}km` : 'N/A'}</p>
                      <p className="text-xs text-slate-400">Depth: ±{eq.depthError ? `${eq.depthError}km` : 'N/A'}</p>
                    </div>
                  </div>

                </div>
              </Card>

            </div>

            {/* Right Hand: Related Events Panel */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle size={18} className="text-slate-500" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-650 dark:text-slate-350">
                  Regional Occurrences
                </h3>
              </div>

              {relatedLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-xl" />
                  ))}
                </div>
              ) : relatedEvents.length === 0 ? (
                <Card className="border border-slate-200/50 dark:border-slate-800/50 p-6 text-center text-xs text-slate-500">
                  No other recent incidents recorded in this immediate regional search segment.
                </Card>
              ) : (
                <div className="space-y-3">
                  {relatedEvents.map((item) => (
                    <Card 
                      key={item._id || item.id}
                      onClick={() => navigate(`/earthquake/${item._id || item.id}`)}
                      className="p-3.5 border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/40 dark:hover:bg-slate-850/40 cursor-pointer transition-all flex justify-between items-center"
                    >
                      <div className="space-y-0.5 min-w-0 pr-2">
                        <p className="text-xs font-bold truncate text-slate-800 dark:text-slate-200">{item.place}</p>
                        <p className="text-[10px] text-slate-500">{new Date(item.time).toLocaleDateString()}</p>
                      </div>
                      <SeverityBadge mag={item.mag} />
                    </Card>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </>
  );
};

export default EarthquakeDetails;
