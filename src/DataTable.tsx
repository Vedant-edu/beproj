import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const tableName = 'example_table';

function DataTable() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data: fetchedData, error: fetchError } = await supabase.from(tableName).select(`id, Vehicle_Number, created_at, image_url`);
      if (fetchError) {
        console.error('Error fetching data:', fetchError);
        setError(fetchError.message);
        return;
      }
      setData(fetchedData);
      setLastUpdated(new Date().toLocaleTimeString());
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
              {data.map((row, index) => (
                <tr key={index} className="border border-gray-400 p-2">
                  {Object.entries(row).filter(([key]) => key !== 'local_path').map(([key, value]) => (
                    <td key={key} className="border border-gray-400 p-2">
                      {key === 'image_url' ? (
                        <div 
                          onMouseEnter={() => setHoveredImage(value)}
                          onMouseLeave={() => setHoveredImage(null)}
                          className="relative"
                        >
                          <a className='underline text-blue-500' href={value} target="_blank" rel="noopener noreferrer">
                            view image
                          </a>
                          {hoveredImage === value && (
                            <div className="absolute top-0 left-5 mt-2 p-2 bg-white border border-gray-300 shadow-lg z-10">
                              <img src={value} alt="Preview" className="w-32 h-32 object-cover" />
                            </div>
                          )}
                        </div>
                      ) : (
                        value
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>No data found. Seems there is issue with the database!</p>
      )}
    </div>
  );
}

export default DataTable;
