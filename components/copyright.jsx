import React from 'react';

const Copyright = () => {
  const from = 2020;
  const year = new Date().getFullYear();
  const str = from + (year > from ? `–${year} ` : ' ');
  return (
    <h5 className="copyright">
      &copy;
      {str}
      {' '}
      Dom Wakeling
    </h5>
  );
};

export default Copyright;
