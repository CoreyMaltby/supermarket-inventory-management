import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import InventoryList from './components/InventoryList.jsx';
import AddProductsForm from './components/AddProductsForm.jsx';
import OrderingScreen from './components/OrderingScreen.jsx';
import RestockScreen from './components/RestockScreen.jsx';
import SupplierDirectory from './components/SuppliersDirectory.jsx';

function App() {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState('admin');

  const fetchInventory = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, quantity, categories ( name )')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching inventory:', error);
    } else {
      setProducts(data || []);
    }
  };

  useEffect(() => {
    fetchInventory();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('Database changed!', payload);
          fetchInventory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const totalInventoryValue = products.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const outOfStockCount = products.filter(item => item.quantity === 0).length;
  const lowStockCount = products.filter(item => item.quantity > 0 && item.quantity < 5).length;

  const renderView = () => {
    switch (view) {
      case 'admin':
        return (
          <>
            <h1>Inventory Admin</h1>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
              <div style={statCardStyle}>
                <h4 style={statLabelStyle}>Total Value</h4>
                <p style={statValueStyle}>£{totalInventoryValue.toFixed(2)}</p>
              </div>
              <div style={statCardStyle}>
                <h4 style={statLabelStyle}>Out of Stock</h4>
                <p style={{ ...statValueStyle, color: '#dc3545' }}>{outOfStockCount}</p>
              </div>
              <div style={statCardStyle}>
                <h4 style={statLabelStyle}>Low Stock</h4>
                <p style={{ ...statValueStyle, color: '#ffc107' }}>{lowStockCount}</p>
              </div>
            </div>

            <AddProductsForm onProductAdded={fetchInventory} />
            <InventoryList products={products} refreshData={fetchInventory} />
          </>
        );
      case 'customer':
        return (
          <>
            <h1>Customer Storefront</h1>
            <OrderingScreen products={products} refreshData={fetchInventory} />
          </>
        );
      case 'restock':
        return (
          <>
            <h1>Admin Restock Portal</h1>
            <RestockScreen products={products} refreshData={fetchInventory} />
          </>
        );
      case 'suppliers':
        return (
          <>
            <SupplierDirectory products={products} />
          </>
        );
      default:
        return <div>Select a view from the menu.</div>;
    }
  };

  const navBtnStyle = (isActive) => ({
    padding: '10px 20px',
    margin: '0 5px',
    backgroundColor: isActive ? '#007bff' : '#f8f9fa',
    color: isActive ? 'white' : 'black',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: isActive ? 'bold' : 'normal',
    transition: '0.2s'
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <nav style={{ marginBottom: '30px', textAlign: 'center', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
        <button onClick={() => setView('admin')} style={navBtnStyle(view === 'admin')}>Admin</button>
        <button onClick={() => setView('customer')} style={navBtnStyle(view === 'customer')}>Storefront</button>
        <button onClick={() => setView('restock')} style={navBtnStyle(view === 'restock')}>Restock</button>
        <button onClick={() => setView('suppliers')} style={navBtnStyle(view === 'suppliers')}>Suppliers</button>
      </nav>

      <main>
        {renderView()}
      </main>
    </div>
  );
}

const statCardStyle = {
  flex: 1,
  padding: '20px',
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  textAlign: 'center'
};

const statLabelStyle = {
  margin: '0 0 10px 0',
  color: '#666',
  fontSize: '0.9rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const statValueStyle = {
  fontSize: '1.8rem',
  fontWeight: 'bold',
  margin: 0,
  color: '#333'
};

export default App;