import React, { useState, useEfect, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import { listItems } from './graphql/queries';
import { createItem as createItemMutation, deleteItem as deleteItemMutation} from './graphql/mutations';

const initialFormState = { title: '', description: '', price: ''};

function App() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const apiData = await API.graphql({ query: listItems });
    setItems(apiData.data.listItems.items);
  }

  async function createItem() {
    if (!formData.title || !formData.description) return;
    await API.graphql({ query: createItemMutation, variables: { input: formData } });
    setItems([ ...items, formData ]);
    setFormData(initialFormState);
  }

  async function deleteItem({ id }) {
    const newItemsArray = items.filter(item => item.id !== id);
    setItems(newItemsArray);
    await API.graphql({ query: deleteItemMutation, variable: { input: { id } }});
  }

  return (
    <div className="App">
      <h1>Welcome to Monster Bids</h1>
      <h1>Catalog of Items</h1>
      <input
        onChange={e => setFormData({ ...formData, 'title': e.target.value})}
        placeholder="Item title"
        value={formData.title}
      />
      <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="Item description"
        value={formData.description}
      />
      <input
        onChange={e => setFormData({ ...formData, 'price': e.target.value})}
        placeholder="Item price"
        value={formData.price}
      />
      <button onClick={createItem}>Create Item</button>
      <div style={{marginBottom: 30}}>
        {
          items.map(item => (
            <div key={item.id || item.title}>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <p>{item.price}</p>
              <button onClick={() => deleteItem(item)}>Delete Item</button>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default App;
