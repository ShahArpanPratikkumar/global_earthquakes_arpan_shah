import React from 'react';
import { Helmet } from 'react-helmet-async';
import EarthquakeTable from '../../components/tables/EarthquakeTable';

const Earthquakes = () => {
  return (
    <>
      <Helmet>
        <title>Earthquake Registry | Global Earthquake Analytics</title>
        <meta name="description" content="Search, filter, and sort through registered global earthquake events. Filter by country, magnitude, and deep focal point coordinates." />
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-outfit text-slate-900 dark:text-white">
            Seismic Registry Database
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search, filter, and drill down into specific earthquake records from global monitoring hubs
          </p>
        </div>

        {/* Paginated, searchable, filterable data table */}
        <EarthquakeTable />
      </div>
    </>
  );
};

export default Earthquakes;
