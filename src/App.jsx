import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        categories ( name )
      `);

    if (error) console.error('Error:', error);
    else setProducts(data);
    setLoading(false);
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Supermarket Inventory Manager</h1>
      <hr />

      {loading ? (
        <p>Loading inventory...</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4' }}>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.categories?.name || 'Uncategorized'}</td>
                <td>${item.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button onClick={fetchInventory} style={{ marginTop: '20px' }}>
        Refresh Data
      </button>
    </div>
  );
}

export default App;