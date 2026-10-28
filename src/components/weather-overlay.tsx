type WeatherOverlayProps = { kind: "sun" | "storm"; taskTitle?: string };

export function WeatherOverlay({ kind, taskTitle }: WeatherOverlayProps) {
  const sunny = kind === "sun";
  return (
    <div className={`weather-scene weather-scene-${kind} fixed inset-0 z-50 flex items-center justify-center`} role="status" aria-live="polite">
      <div className="weather-particles" aria-hidden="true">
        {Array.from({ length: 24 }, (_, i) => <i key={i} />)}
      </div>
      {!sunny && <div className="weather-lightning" aria-hidden="true" />}
      <div className="weather-celebration flex w-full max-w-sm flex-col items-center px-6">
        <div className="weather-symbol relative flex items-center justify-center" aria-hidden="true">
          {sunny ? <>
            <div className="weather-halo" />
            <div className="weather-rays" />
            <svg viewBox="0 0 160 160" className="weather-sun relative h-full w-full">
              <circle className="weather-sun-disc" cx="80" cy="80" r="65" />
              <path className="weather-sun-shine" d="M80 15a65 65 0 0 1 56 98L80 80Z" />
              <g className="weather-sun-mark" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
                <circle cx="80" cy="80" r="15" />
                <path d="M80 49v-6m0 74v-6m31-31h6m-74 0h6m53-22 5-5m-54 54 5-5m44 0 5 5M53 53l5 5" />
              </g>
            </svg>
            <span className="weather-spark weather-spark-one">✧</span>
            <span className="weather-spark weather-spark-two">✧</span>
          </> : <svg viewBox="0 0 180 170" className="weather-storm relative h-full w-full" fill="none">
            <g className="weather-cloud-shape">
              <path className="weather-cloud-back" d="M42 92a28 28 0 0 1-3-56 39 39 0 0 1 73-6 30 30 0 0 1 31 62Z" />
              <path className="weather-cloud-front" d="M37 103a26 26 0 0 1-2-52 34 34 0 0 1 63-7 30 30 0 0 1 27 59Z" />
            </g>
            <g className="weather-raindrops" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
              <path d="m42 117-5 12" /><path d="m64 125-5 12" /><path d="m111 120-5 12" /><path d="m135 114-5 12" />
            </g>
            <path className="weather-bolt" d="m91 96-20 32h15l-10 32 35-44H94l12-20Z" />
          </svg>}
        </div>
        <div className="weather-message mt-5 w-full rounded-3xl border px-5 py-4 text-center">
          <p className="weather-heading text-sm font-bold uppercase">{sunny ? "✧ Solen skiner upp! ✧" : "Åskmolnet drar in"}</p>
          <p className="mt-1 text-base font-bold text-card-foreground">{sunny ? taskTitle ? `”${taskTitle}” avklarad!` : "Uppgiften är avklarad!" : "Du har uppgifter kvar"}</p>
          <p className="mt-1 text-sm text-muted-foreground">{sunny ? "Åskmolnet skingras och dagen lyser klar ☀" : "En ny chans att få solen att skina"}</p>
        </div>
      </div>
    </div>
  );
}