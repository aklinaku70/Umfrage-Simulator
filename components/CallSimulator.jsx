"use client";

import { useEffect, useRef, useState } from "react";
import { SCRIPT_STEPS, buildClientCallFlow, GREETING_LINE } from "@/data/script";
import { speak, stopSpeaking, primeVoices, isSpeechSupported } from "@/lib/tts";
import ClientList from "@/components/ClientList";

const CALL_STATE = {
  IDLE: "idle",
  RINGING: "ringing",
  ACTIVE: "active",
  ENDED: "ended",
};

export default function CallSimulator() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [dialedNumber, setDialedNumber] = useState("");
  const [callState, setCallState] = useState(CALL_STATE.IDLE);
  const [flow, setFlow] = useState(null);
  const [checkedSteps, setCheckedSteps] = useState([]);
  const [transcript, setTranscript] = useState([]);
  const [outcomeText, setOutcomeText] = useState("");
  const [callStates, setCallStates] = useState({}); // { clientId: 'done' | 'refused' | 'noanswer' }
  const [speaking, setSpeaking] = useState(false);
  const [speechOk, setSpeechOk] = useState(true);

  const transcriptRef = useRef(null);

  useEffect(() => {
    primeVoices();
    setSpeechOk(isSpeechSupported());
    return () => stopSpeaking();
  }, []);

  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
  }, [transcript]);

  function log(speaker, text) {
    setTranscript((prev) => [...prev, { speaker, text, time: new Date().toLocaleTimeString("de-DE") }]);
  }

  function handleSelectClient(client) {
    if (callState === CALL_STATE.RINGING || callState === CALL_STATE.ACTIVE) return;
    setSelectedClient(client);
    setDialedNumber("");
    setCallState(CALL_STATE.IDLE);
    setFlow(null);
    setCheckedSteps([]);
    setTranscript([]);
    setOutcomeText("");
  }

  function fillNumberFromClient() {
    if (selectedClient) setDialedNumber(selectedClient.telefon);
  }

  function startCall() {
    if (!selectedClient || !dialedNumber.trim()) return;

    setCallState(CALL_STATE.RINGING);
    setTranscript([]);
    setCheckedSteps([]);
    setOutcomeText("");
    log("system", `Duke thirrur ${dialedNumber} ...`);

    const clientFlow = buildClientCallFlow(selectedClient);
    setFlow(clientFlow);

    window.setTimeout(() => {
      if (selectedClient.persona === "no_answer") {
        log("system", "☎️ Askush nuk përgjigjet.");
        finishCall("noanswer", "Nuk u përgjigj.");
        return;
      }

      setCallState(CALL_STATE.ACTIVE);
      log("client", GREETING_LINE);
      setSpeaking(true);
      speak(GREETING_LINE, { onEnd: () => setSpeaking(false) });
    }, 1600);
  }

  function finishCall(resultKey, outcome) {
    setCallState(CALL_STATE.ENDED);
    setOutcomeText(outcome);
    setCallStates((prev) => ({ ...prev, [selectedClient.id]: resultKey }));
  }

  function handleCheckStep(step, index) {
    if (callState !== CALL_STATE.ACTIVE) return;
    if (checkedSteps.includes(step.id)) return;
    // duhet me rend: vetëm hapi tjetër i pa-check-uar lejohet
    if (index !== checkedSteps.length) return;

    log("agent", step.agentText);
    setCheckedSteps((prev) => [...prev, step.id]);

    const entry = flow?.[step.id];
    if (!entry) return;

    window.setTimeout(() => {
      log("client", entry.text);
      setSpeaking(true);
      speak(entry.text, {
        onEnd: () => {
          setSpeaking(false);
          if (entry.endCall) {
            const resultKey = entry.outcome?.startsWith("PLOTËSUAR")
              ? "done"
              : entry.outcome?.startsWith("REFUZUAR")
              ? "refused"
              : "refused";
            finishCall(resultKey, entry.outcome || "Thirrja përfundoi.");
          }
        },
      });
    }, 500);
  }

  function endCallManually() {
    stopSpeaking();
    setSpeaking(false);
    log("system", "Thirrja u mbyll manualisht.");
    finishCall("refused", "Mbyllur manualisht.");
  }

  const nextStepIndex = checkedSteps.length;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
      <ClientList
        selectedClientId={selectedClient?.id}
        onSelect={handleSelectClient}
        callStates={callStates}
        disabled={callState === CALL_STATE.RINGING || callState === CALL_STATE.ACTIVE}
      />

      <div className="flex flex-col gap-4">
        {!speechOk && (
          <div className="rounded-xl bg-amber-100 p-3 text-sm text-amber-800">
            Browser-i juaj nuk mbështet zë (Web Speech API). Provoni Chrome ose Edge.
          </div>
        )}

        {/* Kartela e klientit + dialer */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          {selectedClient ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <Field label="Emri" value={selectedClient.vorname} />
                <Field label="Mbiemri" value={selectedClient.nachname} />
                <Field label="Adresa" value={selectedClient.adresse} className="col-span-2" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Numri i telefonit (shkruaje para se me thirr)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={dialedNumber}
                    onChange={(e) => setDialedNumber(e.target.value)}
                    disabled={callState === CALL_STATE.RINGING || callState === CALL_STATE.ACTIVE}
                    placeholder="+49 ..."
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100"
                  />
                  <button
                    onClick={fillNumberFromClient}
                    disabled={callState === CALL_STATE.RINGING || callState === CALL_STATE.ACTIVE}
                    className="rounded-lg border border-slate-300 px-3 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                    title="Kopjo numrin e klientit"
                  >
                    Kopjo
                  </button>
                </div>

                {callState === CALL_STATE.IDLE || callState === CALL_STATE.ENDED ? (
                  <button
                    onClick={startCall}
                    disabled={!dialedNumber.trim()}
                    className="mt-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    📞 Telefono
                  </button>
                ) : (
                  <button
                    onClick={endCallManually}
                    className="mt-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    ✖ Mbyll thirrjen
                  </button>
                )}

                {callState === CALL_STATE.RINGING && (
                  <p className="animate-pulse text-sm font-medium text-slate-500">Duke lidhur...</p>
                )}
                {outcomeText && (
                  <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                    Rezultati: {outcomeText}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-slate-400">
              Zgjidh një klient nga lista majtas për të filluar.
            </p>
          )}
        </div>

        {/* Skripti / Checklist-a */}
        {callState === CALL_STATE.ACTIVE && (
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
              Skripti — check-oje me rend {speaking && <span className="text-indigo-500">(klienti po flet...)</span>}
            </h2>
            <ol className="flex flex-col gap-2">
              {SCRIPT_STEPS.map((step, index) => {
                const isChecked = checkedSteps.includes(step.id);
                const isNext = index === nextStepIndex;
                const isLocked = index > nextStepIndex;
                return (
                  <li
                    key={step.id}
                    className={`flex items-start gap-3 rounded-xl border p-3 text-sm transition ${
                      isChecked
                        ? "border-emerald-200 bg-emerald-50"
                        : isNext
                        ? "border-indigo-400 bg-indigo-50"
                        : "border-slate-200 opacity-50"
                    }`}
                  >
                    <button
                      onClick={() => handleCheckStep(step, index)}
                      disabled={isChecked || isLocked}
                      className={`mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full border text-xs font-bold ${
                        isChecked
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-indigo-400 text-indigo-500 hover:bg-indigo-100 disabled:opacity-40"
                      }`}
                    >
                      {isChecked ? "✓" : index + 1}
                    </button>
                    <div>
                      <p className="font-semibold text-slate-700">{step.label}</p>
                      <p className="text-slate-600">{step.agentText}</p>
                      {step.options && (
                        <p className="mt-1 text-xs font-medium text-slate-400">
                          {step.options.join("   ·   ")}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {/* Transkripti */}
        {transcript.length > 0 && (
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Biseda</h2>
            <div ref={transcriptRef} className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1 text-sm">
              {transcript.map((t, i) => (
                <div
                  key={i}
                  className={`rounded-lg px-3 py-1.5 ${
                    t.speaker === "agent"
                      ? "self-end bg-indigo-600 text-white"
                      : t.speaker === "client"
                      ? "self-start bg-slate-200 text-slate-800"
                      : "self-center text-xs italic text-slate-400"
                  }`}
                >
                  {t.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, className = "" }) {
  return (
    <div className={className}>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="font-medium text-slate-800">{value}</p>
    </div>
  );
}
