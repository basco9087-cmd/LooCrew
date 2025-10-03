import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setCodeSent(true);
  };

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-slate-900 bg-slate-900/80 p-6 shadow-lg">
      <h1 className="text-2xl font-semibold text-slate-50">Crew Login</h1>
      <p className="mt-2 text-sm text-slate-400">
        Enter your email or phone number and we will send a one-time code. No passwords, just speedy relief.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm text-slate-300">
          Contact info
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="you@example.com"
            className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-600 focus:border-amber-300 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-lg bg-amber-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-amber-300"
        >
          {codeSent ? "Code Sent" : "Send Magic Code"}
        </button>
      </form>
      {codeSent && (
        <p className="mt-4 text-sm text-emerald-300">
          Check your inbox for the code. Once verified you can drop logs with friends.
        </p>
      )}
    </section>
  );
};

export default Login;
