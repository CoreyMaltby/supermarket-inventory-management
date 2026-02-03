import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AddProductsForm({ onProductAdded }) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState(1);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { erorr } = await supabase.from('products').insert([{ name, price: parseFloat(price), category_id: categoryId }]);

        if (error) {
            alert(error.message);
        } else {
            setName('');
            setPrice('');
            onProductAdded();
        }
    };
    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd' }}>
            <h3>Add New Product</h3>
            <input
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
            />
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="1">Produce</option>
                <option value="2">Dairy</option>
                <option value="3">Bakery</option>
                <option value="4">Frozen Foods</option>
            </select>
            <button type="submit">Add Product</button>
        </form>
    );
}