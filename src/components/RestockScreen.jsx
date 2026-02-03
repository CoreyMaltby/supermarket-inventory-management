import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function RestockScreen({ products, refreshData }) {
    const [restockAmounts, setRestockAmounts] = useState({});

    const handleRestock = async (product) => {
        const amountToAdd = parseInt(restockAmounts[product.id] || 0);

        if (amountToAdd <= 0) {
            alert("Please enter a valid quantity to restock.");
            return;
        }

        const { error } = await supabase
            .from('products')
            .update({ quantity: product.quantity + amountToAdd })
            .eq('id', product.id);

        if (error) {
            alert(error.message);
        } else {
            setRestockAmounts({ ...restockAmounts, [product.id]: '' });
            alert(`Successfully added ${amountToAdd} units to ${product.name}`);
        }
        refreshData();
    };

    const handleInputChange = (id, value) => {
        setRestockAmounts({ ...restockAmounts, [id]: value });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Admin Restock Portal</h2>
            <p>Use this screen to add stock received from suppliers.</p>

            <div style={{ display: 'grid', gap: '15px' }}>
                {products.map((item) => (
                    <div key={item.id} style={cardStyle}>
                        <div>
                            <strong>{item.name}</strong><br />
                            <small>Current Stock: {item.quantity}</small>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                                type="number"
                                placeholder="Qty"
                                value={restockAmounts[item.id] || ''}
                                onChange={(e) => handleInputChange(item.id, e.target.value)}
                                style={{ width: '60px', padding: '5px' }}
                            />
                            <button
                                onClick={() => handleRestock(item)}
                                style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px' }}
                            >
                                Restock
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const cardStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff'
};