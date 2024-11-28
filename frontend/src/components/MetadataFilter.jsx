import React from 'react';
import './css/HomePage.css';

const MetadataFilter = ({metadataFilters, updateMetadataFilter}) => {
  return (
    <div className="w-62 fixed bg-green-900 p-2 my-4 rounded z-10">
          {metadataFilters.map((filter, index) => (
            <div key={index} className="flex w-full gap-4 items-center p-1">
            <div className='text-xs'>{filter.key}:</div>
              <input
                type="text"
                value={filter.value}
                onChange={(e) =>
                  updateMetadataFilter(index, filter.key, e.target.value)
                }
                className="input-underline text-xs"
                placeholder={filter.key}
              />
            </div>
          ))}
     </div>
  );
};

export default MetadataFilter;
