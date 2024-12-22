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
        .select('id, Vehicle_Number, created_at, image_url')
        .order('id', { ascending: false });

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
    <div className='p-4 h-[74vh] rounded-lg'>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data.length > 0 ? (
        <>
          <div className="">
            <div className="py-1 bg-gray-200 w-[250px] rounded-full  flex items-center justify-center">

              <span>Last updated at</span>
              <span className="inline-flex items-center rounded-full ml-2 bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white">
              {lastUpdated}
              </span>
            </div>
          </div>
          <table className="table-fixed border-collapse w-full text-center rounded-xl mt-2">
            <thead className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-t-lg">
              <tr>
                <th className="p-4 text-gray-700 w-12 rounded-tl-xl">ID</th>
                <th className="p-4 text-gray-700 ">Vehicle Number</th>
                <th className="p-4 text-gray-700 ">Created At</th>
                <th className="p-4 text-gray-700 rounded-tr-xl">Image URL</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-100 transition-colors rounded-lg">
                  <td className="p-4 border-b border-gray-300 rounded-lg">{row.id}</td>
                  <td className="p-4 border-b border-gray-300 rounded-lg ">{row.Vehicle_Number}</td>
                  <td className="p-4 border-b border-gray-300 rounded-lg">{new Date(row.created_at).toLocaleString()}</td>
                  <td className="p-4 border-b border-gray-300 rounded-lg">
                    <div
                      onMouseEnter={() => setHoveredImage(row.image_url)}
                      onMouseLeave={() => setHoveredImage(null)}
                      className="relative rounded-lg"
                    >
                      <a className='text-blue-500 hover:underline' href={row.image_url} target="_blank" rel="noopener noreferrer">
                        view image
                      </a>
                      {hoveredImage === row.image_url && (
                        <div className="absolute top-0 left-5 mt-2 p-2 bg-white border border-gray-300 rounded-lg z-10">
                          <img src={row.image_url} alt="Preview" className="w-32 h-32 object-cover rounded-md" />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr className="my-4 border-t border-gray-200 rounded-lg" />
        </>
      ) : (
        <p className='text-gray-500'>No data found. Seems there is an issue with the database!</p>
      )}
    </div>
  );
}

export default DataTable;
