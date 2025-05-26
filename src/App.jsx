import { useState, useEffect } from "react";

const categories = ["Alimentación", "Transporte", "Salud", "Entretenimiento", "Otros"];

export default function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({
    type: "gasto",
    amount: "",
    category: "Alimentación",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || isNaN(form.amount)) return;
    setTransactions((prev) => [...prev, { ...form, id: Date.now() }]);
    setForm({ ...form, amount: "", description: "" });
  };

  const handleDelete = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const balance = transactions.reduce((acc, t) => {
    const amt = parseFloat(t.amount);
    return t.type === "ingreso" ? acc + amt : acc - amt;
  }, 0);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📊 Expense Tracker</h1>

      <form onSubmit={handleSubmit} className="grid gap-2 mb-6">
        <div className="flex gap-2">
          <select name="type" value={form.type} onChange={handleChange} className="border px-2 py-1 rounded">
            <option value="gasto">Gasto</option>
            <option value="ingreso">Ingreso</option>
          </select>

          <input
            name="amount"
            type="number"
            placeholder="Monto"
            value={form.amount}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
            required
          />
        </div>

        <select name="category" value={form.category} onChange={handleChange} className="border px-2 py-1 rounded">
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          name="description"
          type="text"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
          className="border px-2 py-1 rounded"
        />

        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="border px-2 py-1 rounded"
        />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Añadir
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Balance: ${balance.toFixed(2)}</h2>

      <ul className="space-y-2">
        {transactions.map((t) => (
          <li key={t.id} className="border p-2 rounded flex justify-between items-center">
            <div>
              <p className="font-medium">{t.type === "ingreso" ? "+" : "-"}${parseFloat(t.amount).toFixed(2)} — {t.category}</p>
              <p className="text-sm text-gray-600">{t.description || "Sin descripción"} | {t.date}</p>
            </div>
            <button onClick={() => handleDelete(t.id)} className="text-red-500">Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
