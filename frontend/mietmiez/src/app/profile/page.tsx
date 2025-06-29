'use client';
import React, { useState } from 'react';

type EditableFieldProps = {
  label: string;
  fieldName: string;
  value: string;
  onUpdate: (field: string, newValue: string, oldValue: string) => void;
};

const EditableField: React.FC<EditableFieldProps> = ({ label, fieldName, value, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [oldVal, setOldVal] = useState('');
  const [newVal, setNewVal] = useState('');

  const handleSave = () => {
    if (oldVal !== value) {
      alert('Alte Eingabe stimmt nicht überein.');
      return;
    }
    onUpdate(fieldName, newVal, oldVal);
    setShowModal(false);
    setOldVal('');
    setNewVal('');
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <span><strong>{label}:</strong> {value}</span>
        <button onClick={() => setShowModal(true)} className="text-blue-600 hover:underline">✏️</button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-xl w-80">
            <h3 className="mb-4 text-lg font-semibold">Bearbeite {label}</h3>
            <input
              placeholder="Alte Eingabe"
              value={oldVal}
              onChange={e => setOldVal(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              placeholder="Neue Eingabe"
              value={newVal}
              onChange={e => setNewVal(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="text-gray-600">Abbrechen</button>
              <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">Speichern</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableField;

