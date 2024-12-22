import { useEffect, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey: string = import.meta.env.VITE_SUPABASE_KEY;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

const tableName = 'example_table';

type TableRow = {
  id: number;
  Vehicle_Number: string;
  created_at: string;
  image_url: string;
};

function DataTable() {
  const [data, setData] = useState<TableRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: fetchedData, error: fetchError } = await supabase
      .from(tableName)
      .select('id, Vehicle_Number, created_at, image_url');

      if (fetchError) {
        console.error('Error fetching data:', fetchError);
        setError(fetchError.message);
        return;
      }

      if (fetchedData) {
        setData(fetchedData);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    }

    fetchData();

    const intervalId = setInterval(fetchData, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className='p-4 h-[74vh]'>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data.length > 0 ? (
        <>
          <p className='text-sm text-gray-500'>Last updated at: {lastUpdated}</p>
          <table className="table-fixed border-collapse border border-gray-400 w-full text-center rounded-lg">
            <thead className="border border-gray-400 bg-sky-200">
              <tr className='p-6'>
                <th className="border border-gray-400 w-12 p-4">ID</th>
                <th className="border border-gray-400">Vehicle Number</th>
                <th className="border border-gray-400">Created At</th>
                <th className="border border-gray-400">Image URL</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border border-gray-400 p-2">
                  <td className="border border-gray-400 p-2">{row.id}</td>
                  <td className="border border-gray-400 p-2">{row.Vehicle_Number}</td>
                  <td className="border border-gray-400 p-2">{new Date(row.created_at).toLocaleString()}</td>
                  <td className="border border-gray-400 p-2">
                    <div 
                      onMouseEnter={() => setHoveredImage(row.image_url)}
                      onMouseLeave={() => setHoveredImage(null)}
                      className="relative"
                    >
                      <a className='underline text-blue-500' href={row.image_url} target="_blank" rel="noopener noreferrer">
                        view image
                      </a>
                      {hoveredImage === row.image_url && (
                        <div className="absolute top-0 left-5 mt-2 p-2 bg-white border border-gray-300 shadow-lg z-10">
                          <img src={row.image_url} alt="Preview" className="w-32 h-32 object-cover" />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>No data found. Seems there is an issue with the database!</p>
      )}
    </div>
  );
}

export default DataTable;
