import React from 'react';

interface ProgressItemListProps {
  items: string[];
  title: string;
}

const ProgressItemList: React.FC<ProgressItemListProps> = ({ items, title }) => {
  return (
    <div className="mb-4">
      <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
      <ul className="list-disc list-inside space-y-1 text-gray-600">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProgressItemList;
