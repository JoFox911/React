import { useState } from 'react';

function InsertedItemsTable({items, onDeleteItemClick}) {
  return (
    <div>
      <p>{JSON.stringify(items)}</p>
      <table>
        <thead>
          <tr>
            <th>Valet</th>
            <th>Tokens</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((row, index) => (
            <tr valet={index}>
              <td>
                <p>{row.valet}</p>
              </td>
              <td>
                <p>{row.tokenIds}</p>
              </td>
              <td>
                <button onClick={() => onDeleteItemClick(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InputTokensForm({ onSubmitClick }) {
  const [valet, setValet] = useState("");
  const [tokenIds, setTokenIds] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the onSubmitClick function and pass the form data to it
    onSubmitClick({ valet, tokenIds });
    setValet("")
    setTokenIds("")
  };

  // Determine if the button should be disabled
  const isButtonDisabled = valet === "" || tokenIds === "";

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Input 1:
            <input
              type="text"
              value={valet}
              onChange={e => setValet(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Input 2:
            <input
              type="text"
              value={tokenIds}
              onChange={e => setTokenIds(e.target.value)}
            />
          </label>
        </div>
        <button type="submit" disabled={isButtonDisabled}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default function App() {
  const [insertedItems, setNewItem] = useState([]);

  function addNewItem(newItem) {
    const nextSquares = insertedItems.slice()
    nextSquares.push(newItem)
    setNewItem(nextSquares)
  }

  function removeItem(index) {
    const nextSquares = [...insertedItems.slice(0, index), ...insertedItems.slice(index + 1)];
    setNewItem(nextSquares)
  }

  return (
    <div>
      <InputTokensForm onSubmitClick={addNewItem}/>
      <InsertedItemsTable items={insertedItems} onDeleteItemClick={removeItem} />
    </div>
  );
}
