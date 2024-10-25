import { useState } from "react";

// const initialItems = [
//   { id: 1, description: "Passports", quantity: 2, packed: false },
//   { id: 2, description: "Socks", quantity: 12, packed: true },
// ];
export default function App() {
  const [items, setItems] = useState([]);
  function handelAddItems(item) {
    setItems((i) => [...i, item]);
  }
  function deleteItems(key) {
    setItems((i) => i.filter((item) => item.id !== key));
  }

  function updateItems(key) {
    setItems((items) =>
      items.map((item) =>
        item.id === key ? { ...item, packed: !item.packed } : item
      )
    );
  }

  function clearItems() {
    setItems((items) => {
      return [];
    });
  }
  return (
    <div className="app">
      <Logo />
      <From onAddItems={handelAddItems} />
      <PackingList
        items={items}
        deleteItems={deleteItems}
        updateItems={updateItems}
        clearItems={clearItems}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>✈️ Far Away 🌃</h1>;
}
function From({ onAddItems }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  function handelSubmit(e) {
    e.preventDefault();
    if (!description) return;
    const newItem = { description, quantity, packed: false, id: Date.now() };
    onAddItems(newItem);
    setDescription("");
    setQuantity(1);
  }
  return (
    <form className="add-form" onSubmit={handelSubmit}>
      <h3>What do you need for your trip ✈️ ?</h3>
      <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        maxLength="50"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">ADD</button>
    </form>
  );
}
function PackingList({ items, deleteItems, updateItems, clearItems }) {
  const [sortVal, setSortVal] = useState("input");
  let sortedItems = items.slice();
  if (sortVal === "input") items.slice();
  if (sortVal === "description")
    sortedItems = sortedItems.sort((a, b) =>
      a.description.localeCompare(b.description)
    );
  if (sortVal === "packed")
    sortedItems = sortedItems.sort((a, b) => {
      return Number(a.packed) - Number(b.packed);
    });
  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => {
          return (
            <Item
              item={item}
              key={item.id}
              deleteItems={deleteItems}
              updateItems={updateItems}
            />
          );
        })}
      </ul>
      <div className="action">
        <select value={sortVal} onChange={(e) => setSortVal(e.target.value)}>
          <option value="input"> Sort by input order</option>
          <option value="description"> Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>
        <button onClick={clearItems}>clear list</button>
      </div>
    </div>
  );
}
function Item({ item, deleteItems, updateItems }) {
  return (
    <li>
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {" "}
        <input
          type="checkbox"
          onClick={() => {
            return updateItems(item.id);
          }}
        />{" "}
        {item.quantity} {item.description}
      </span>
      <button
        onClick={() => {
          deleteItems(item.id);
        }}
      >
        ❌
      </button>
    </li>
  );
}
function Stats({ items }) {
  const itemsPecentage = (items) => {
    if (Number((items.filter((i) => i.packed).length / items.length) * 100))
      return Math.round(
        Number((items.filter((i) => i.packed).length / items.length) * 100)
      );
    else {
      return 0;
    }
  };
  const packedItems = items.filter((i) => i.packed).length;
  return (
    <footer className="stats">
      <em>
        {items.length
          ? `You have ${
              items.length
            } items on your list and you  packed ${packedItems} (${itemsPecentage(
              items
            )}%) of them .`
          : `Start adding items to your list.`}
      </em>
    </footer>
  );
}
