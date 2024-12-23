import './App.css';
import DataTable from '../src/DataTable';
function App() {

  return (
    <>
      <div className=''>
        <div>
          <div className='text-3xl text-semibold p-6 bg-gradient-to-r from-indigo-200 to-yellow-100 mb-4 flex gap-4 '>
            <img src="/image.png" alt="" height={40} width={40} />
            <h1>Number Plate Detection Database  </h1>
            </div>
          <DataTable />
        </div>
        
      </div>
    </>
  )
}

export default App
