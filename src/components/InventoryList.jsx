import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function InventoryList({ products, refreshData }) {
    // Local states for editing
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editPrice, setEditPrice] = useState('');
    const [editQuantity, setEditQuantity] = useState(0);

    const startEdit = (product) => {
        setEditingId(product.id);
        setEditName(product.name);
        setEditPrice(product.price);
        setEditQuantity(product.quantity);
    };

    // Handle updating a product
    const handleUpdate = async (id) => {
        const { error } = await supabase
            .from('products')
            .update({
                name: editName,
                price: parseFloat(editPrice),
                quantity: parseInt(editQuantity)
            })
            .eq('id', id);

        if (error) {
            alert(error.message);
        } else {
            setEditingId(null);
            refreshData();
        }
    };


    // Handle deleting a product
    const handleDelete = async (id) => {
        if (window.confirm("Delete this item?")) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) console.error(error);
            else refreshData();
        }
    };

    return (
        <table border="1" cellPadding="10" style={tableStyle}>
            <thead>
                <tr style={{ backgroundColor: '#f4f4f4' }}>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock Level</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map((item) => (
                    <tr key={item.id}>
                        {editingId === item.id ? (
                            <>
                                <td><input value={editName} onChange={(e) => setEditName(e.target.value)} /></td>
                                <td>{item.categories?.name}</td>
                                <td><input type="number" step="0.01" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} style={{ width: '60px' }} /></td>
                                <td><input type="number" value={editQuantity} onChange={(e) => setEditQuantity(e.target.value)} style={{ width: '60px' }} /></td>
                                <td>
                                    <button onClick={() => handleUpdate(item.id)} style={{ color: 'green' }}>Save</button>
                                    <button onClick={() => setEditingId(null)}>Cancel</button>
                                </td>
                            </>
                        ) : (
                            <>
                                <td>{item.name}</td>
                                <td>{item.categories?.name}</td>
                                <td>£{item.price.toFixed(2)}</td>
                                <td style={{ color: item.quantity < 5 ? 'red' : 'inherit', fontWeight: item.quantity < 5 ? 'bold' : 'normal' }}>
                                    {item.quantity} {item.quantity < 5 && '(LOW STOCK!)'}
                                </td>
                                <td>
                                    <button onClick={() => startEdit(item)}>Edit</button>
                                    <button onClick={() => handleDelete(item.id)} style={{ color: 'red', marginLeft: '5px' }}>Delete</button>
                                </td>
                            </>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    textAlign: 'left'
};