import React from 'react';

export default function Example({ name = 'mundo' }) {
  return (
    <div className="example-component">
      <h2>Hola desde React</h2>
      <p>Props recibidos: {name}</p>
    </div>
  );
}