import { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./Login.jsx";
import { fetchRestrooms } from "../api";

const Dashboard = () => {
  const [restrooms, setRestrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchRestrooms();
        setRestrooms(data);
      } catch (err) {
        setError("Could not load restrooms");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <p className="px-6 py-4 text-slate-400">Loading nearby restrooms...</p>;
  }

  if (error) {
    return <p className="px-6 py-4 text-red-400">{error}</p>;
  }

  return (
    <div className="space-y-4">
      {restrooms.map((restroom) => (
        <article key={restroom.id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-50">{restroom.name}</h2>
              <p className="text-sm text-slate-400">{restroom.description || "No description yet."}</p>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-medium text-emerald-300">
              Cleanliness {restroom.cleanliness ?? 0}/5
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="rounded border border-slate-800 px-2 py-1 uppercase tracking-wide">{restroom.type}</span>
            {restroom.access_notes && (
              <span className="rounded border border-slate-800 px-2 py-1">{restroom.access_notes}</span>
            )}
          </div>
        </article>
      ))}
    </div>
  );
};

const AppShell = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-900 bg-slate-900/60">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-semibold text-amber-300">
            LooCrew
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate-400">
            <Link to="/" className="hover:text-slate-100">
              Map & Feed
            </Link>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-full border border-slate-700 px-4 py-1 text-slate-100 hover:border-amber-300 hover:text-amber-200"
            >
              Login
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppShell>
            <Dashboard />
          </AppShell>
        }
      />
      <Route
        path="/login"
        element={
          <AppShell>
            <Login />
          </AppShell>
        }
      />
    </Routes>
  );
};

export default App;
