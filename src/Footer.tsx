import React from 'react';

const Footer: React.FC = () => {
  return (
    <>
      <div className='border border-slate-300'></div>
    <div className='p-4'>
    <footer className='text-[12px] '>
      <p> All rights reserved.</p> 
      <p>&copy; {new Date().getFullYear()} Remote Data Exchange.</p>
    </footer>
    </div>
    </>
  );
};

export default Footer;
