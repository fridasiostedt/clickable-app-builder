import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Clock, Home, Plus, Trash2, User, Check } from "lucide-react";
import forest from "@/assets/forest.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "To-Do – Dina uppgifter" },
      { name: "description", content: "Enkel att-göra-lista med tider och påminnelser." },
      { property: "og:title", content: "To-Do – Dina uppgifter" },
      { property: "og:description", content: "Enkel att-göra-lista med tider och påminnelser." },
    ],
  }),
  component: App,
});

type Task = { id: string; title: string; date: string; time: string; reminder: string; done: boolean };

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const today = new Date();
const seed: Task[] = [
  { id: "1", title: "Ring tandläkaren", date: iso(today), time: "08:30", reminder: "15 min innan", done: false },
  { id: "2", title: "Möte med banken", date: iso(today), time: "10:00", reminder: "30 min innan", done: false },
  { id: "3", title: "Ring mormor", date: iso(today), time: "14:00", reminder: "10 min innan", done: false },
];
const MONTHS = ["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december"];
const DAYS = ["söndag","måndag","tisdag","onsdag","torsdag","fredag","lördag"];

function SunIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <g className="w-sun-rays text-sun" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="2.5" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="21.5" />
        <line x1="2.5" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="21.5" y2="12" />
        <line x1="5.3" y1="5.3" x2="7" y2="7" />
        <line x1="17" y1="17" x2="18.7" y2="18.7" />
        <line x1="5.3" y1="18.7" x2="7" y2="17" />
        <line x1="17" y1="7" x2="18.7" y2="5.3" />
      </g>
      <circle className="w-sun-core text-sun" cx="12" cy="12" r="5" fill="currentColor" />
    </svg>
  );
}

function StormIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <g className="w-cloud">
        <path className="text-cloud" d="M6.8 13.5a4 4 0 0 1 .6-7.95A5 5 0 0 1 17.1 7a3.25 3.25 0 0 1 .35 6.5H6.8z" fill="currentColor" />
      </g>
      <g className="text-rain" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <line className="w-drop" x1="8.2" y1="15" x2="8.2" y2="16.8" style={{ animationDelay: "0s" }} />
        <line className="w-drop" x1="11.8" y1="15" x2="11.8" y2="16.8" style={{ animationDelay: "0.4s" }} />
        <line className="w-drop" x1="15.4" y1="15" x2="15.4" y2="16.8" style={{ animationDelay: "0.8s" }} />
      </g>
      <polygon className="w-bolt text-bolt" points="12.6,14.5 10.4,18.8 12,18.8 10.9,22 14.4,17.2 12.7,17.2 14,14.5" fill="currentColor" />
    </svg>
  );
}

function App() {
  const [view, setView] = useState<"home" | "add">("home");
  const [tasks, setTasks] = useState<Task[]>(seed);
  const [selected, setSelected] = useState(iso(today));

  useEffect(() => {
    const s = localStorage.getItem("todo-tasks");
    if (s) setTasks(JSON.parse(s));
  }, []);
  const save = (t: Task[]) => { setTasks(t); localStorage.setItem("todo-tasks", JSON.stringify(t)); };

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <h1 className="text-lg font-bold tracking-widest">TO-DO</h1>
        <button aria-label="Profil" className="flex h-9 w-9 items-center justify-center rounded-full bg-sage text-sage-foreground"><User size={16} /></button>
      </header>
      <main className="flex-1 pb-28">
        {view === "home"
          ? <HomeView tasks={tasks} save={save} selected={selected} setSelected={setSelected} />
          : <AddView onSave={(t) => { save([...tasks, t].sort((a, b) => a.time.localeCompare(b.time))); setSelected(t.date); setView("home"); }} />}
      </main>
      <nav className="fixed bottom-0 left-1/2 flex h-16 w-full max-w-md -translate-x-1/2 items-center justify-between border-t border-border bg-background px-10">
        <button aria-label="Hem" onClick={() => { setSelected(iso(today)); setView("home"); }}><Home size={28} /></button>
        <button aria-label="Ny uppgift" onClick={() => setView("add")} className="-mt-12 flex h-14 w-14 items-center justify-center rounded-full bg-sage text-sage-foreground shadow-lg transition-transform active:scale-95"><Plus size={32} strokeWidth={3} /></button>
        <button aria-label="Kalender" onClick={() => setView("add")}><Calendar size={28} /></button>
      </nav>
    </div>
  );
}

function HomeView({ tasks, save, selected, setSelected }: { tasks: Task[]; save: (t: Task[]) => void; selected: string; setSelected: (s: string) => void }) {
  const d = new Date(selected + "T00:00");
  const list = tasks.filter((t) => t.date === selected);
  const allDone = list.length > 0 && list.every((t) => t.done);
  const shift = (n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); setSelected(iso(x)); };
  return (
    <>
      <img src={forest} alt="Skogsstig" width={1280} height={640} className="h-44 w-full object-cover" />
      <div className="px-4">
        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
          <div className="flex min-w-0 items-center gap-3 rounded-3xl bg-card px-5 py-4 text-card-foreground">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide">{DAYS[d.getDay()]} {d.getDate()} {(MONTHS[d.getMonth()] ?? "").slice(0, 3)} {d.getFullYear()}</p>
              <p className="mt-1 truncate text-xl font-medium text-sage">Hej Jonatan!</p>
            </div>
            {list.length > 0 && (allDone ? <SunIcon className="h-10 w-10 ml-auto shrink-0" /> : <StormIcon className="h-10 w-10 ml-auto shrink-0" />)}
          </div>
          <div className="flex shrink-0 gap-1.5">
            <button aria-label="Föregående dag" onClick={() => shift(-1)} className="rounded-full bg-card p-2 text-card-foreground"><ChevronLeft size={16} /></button>
            <button aria-label="Nästa dag" onClick={() => shift(1)} className="rounded-full bg-card p-2 text-card-foreground"><ChevronRight size={16} /></button>
          </div>
        </div>
        <div className="mt-5 grid gap-3 rounded-3xl bg-card p-4 text-card-foreground">
            {list.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Inga uppgifter. Tryck på + för att lägga till.</p>}
          {list.map((t) => (
            <div key={t.id} className="flex items-center gap-3 rounded-2xl border border-card-foreground/70 px-4 py-4">
              <button aria-label="Klar" onClick={() => save(tasks.map((x) => x.id === t.id ? { ...x, done: !x.done } : x))}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-card-foreground ${t.done ? "bg-sage border-sage text-sage-foreground" : ""}`}>
                {t.done && <Check size={12} strokeWidth={3} />}
              </button>
              <div className="min-w-0 flex-1">
                <p className={`truncate font-bold ${t.done ? "line-through opacity-50" : ""}`}>{t.title}</p>
                <p className="mt-1 flex items-center gap-1 text-xs"><Clock size={12} /> {t.time} • Påminnelse {t.reminder}</p>
              </div>
              {t.done ? <SunIcon className="h-6 w-6 shrink-0" /> : <StormIcon className="h-6 w-6 shrink-0" />}
              <button aria-label="Ta bort" onClick={() => save(tasks.filter((x) => x.id !== t.id))}><Trash2 size={18} /></button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AddView({ onSave }: { onSave: (t: Task) => void }) {
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(iso(today));
  const [time, setTime] = useState("10:00");
  const [reminder, setReminder] = useState("Ingen");
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const first = (month.getDay() + 6) % 7;
  const cells = Array.from({ length: 42 }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i - first + 1));
  const rows = cells[35]?.getMonth() === month.getMonth() ? cells : cells.slice(0, 35);
  const pill = (on: boolean) => `rounded-full border px-4 py-2 text-sm font-medium transition-colors ${on ? "bg-sage border-sage text-sage-foreground" : "border-card-foreground"}`;

  return (
    <div className="grid gap-4 px-4 pt-4 text-card-foreground">
      <div className="space-y-4">
        <div className="rounded-3xl bg-card px-5 py-4">
          <p className="text-xs font-medium uppercase">Vad vill du göra?</p>
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Skriv uppgift här.."
            className="mt-1 w-full bg-transparent text-lg font-medium text-sage placeholder:text-sage outline-none" />
        </div>
        <div className="rounded-3xl bg-card p-4">
          <div className="flex items-center justify-between border-b-2 border-muted-foreground/40 pb-2">
            <span className="flex items-center gap-2 text-sm font-medium"><Clock size={14} /> TID</span>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="rounded-full border border-card-foreground bg-transparent px-6 py-1.5 text-sm" />
          </div>
          <p className="mt-3 text-sm font-medium">PÅMINNELSE</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {["Ingen", "10 min innan", "30 min innan"].map((r) => <button key={r} className={pill(reminder === r) + " px-2"} onClick={() => setReminder(r)}>{r}</button>)}
          </div>
          <div className="mt-5 text-center">
            <button disabled={!title.trim()} onClick={() => onSave({ id: crypto.randomUUID(), title: title.trim(), date, time, reminder: reminder === "Ingen" ? "ingen" : reminder, done: false })}
              className="rounded-full bg-sage px-8 py-2.5 text-sm font-medium text-sage-foreground disabled:opacity-50">Spara uppgift</button>
          </div>
        </div>
      </div>
      <div className="rounded-3xl bg-card p-4">
        <div className="mb-3 flex gap-3">
          <button className={pill(date === iso(today))} onClick={() => setDate(iso(today))}>Idag ({today.getDate()}:e)</button>
          <button className={pill(date === iso(tomorrow))} onClick={() => setDate(iso(tomorrow))}>Imorgon</button>
        </div>
        <div className="rounded-2xl border border-card-foreground p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-medium uppercase">{MONTHS[month.getMonth()]} {month.getFullYear()}</p>
            <div className="flex gap-2">
              <button aria-label="Förra månaden" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft size={16} /></button>
              <button aria-label="Nästa månad" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight size={16} /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-y-2 text-center text-sm">
            {["M","T","O","T","F","L","S"].map((d, i) => <span key={i} className="pb-1 font-medium">{d}</span>)}
            {rows.map((c) => {
              const k = iso(c); const out = c.getMonth() !== month.getMonth();
              return <button key={k} onClick={() => setDate(k)} className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${k === date ? "bg-sage text-sage-foreground" : out ? "opacity-30" : ""}`}>{c.getDate()}</button>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
