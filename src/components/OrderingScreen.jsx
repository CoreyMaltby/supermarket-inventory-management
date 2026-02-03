import { supabase } from '../supabaseClient';

export default function OrderingScreen({ products, refreshData }) {
    const handleOrder = async (product) => {
        // Check if the product is in stock
        if (product.quantity <= 0) {
            alert('This item is currently out of stock!');
            return;
        }

        // Perform an UPDATE operation to decrease the product quantity
        const { error } = await supabase
            .from('products')
            .update({ quantity: product.quantity - 1 })
            .eq('id', product.id); // Identify the product by its ID

        if (error) {
            console.error('Order failed:', error);
            alert('Transaction failed. Please try again.');
        }
        // Refresh the product list to reflect updated stock
        refreshData();
    };

    return (
        <div style={{ marginTop: '20px', padding: '15px', border: '2px solid #333' }}>
            <h2>Customer Ordering Screen</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                {products.map((item) => (
                    <div key={item.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
                        <h4>{item.name}</h4>
                        <p>Price: £{item.price.toFixed(2)}</p>
                        <p>Stock: <strong>{item.quantity}</strong></p>
                        <button
                            onClick={() => handleOrder(item)}
                            disabled={item.quantity <= 0}
                            style={{ backgroundColor: item.quantity > 0 ? '#28a745' : '#ccc', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer' }}
                        >
                            {item.quantity > 0 ? 'Order Now' : 'Out of Stock'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}