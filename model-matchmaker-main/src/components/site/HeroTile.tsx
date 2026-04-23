import { useRef, useState } from "react";
import { FolderOpen, FileCode2, Upload, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImg from "@/assets/hero-scan.jpg";

type ScanState = "idle" | "scanning" | "error";

export const HeroTile = () => {
  const dirRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const navigate = useNavigate();

  const onDir = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files;
    if (f && f.length) {
      setPicked(`${f.length} file${f.length > 1 ? "s" : ""} selected`);
      setFiles(f);
      setScanState("idle");
    }
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files;
    if (f && f[0]) {
      setPicked(f[0].name);
      setFiles(f);
      setScanState("idle");
    }
  };

  const handleScan = async () => {
    if (!files || files.length === 0) return;
    setScanState("scanning");
    setErrorMsg("");

    const form = new FormData();

    // Attach files + their relative paths for directory reconstruction
    const paths: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      form.append("files", f, f.name);
      // webkitRelativePath contains "folder/subdir/file.py" for dir picks
      paths.push((f as File & { webkitRelativePath: string }).webkitRelativePath || f.name);
    }
    paths.forEach((p) => form.append("paths", p));
    form.append("backend", "ollama");

    try {
      const res = await fetch("/api/scan", { method: "POST", body: form });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || "Scan failed");
      }
      const data = await res.json();
      navigate("/results", { state: { results: data } });
    } catch (e: unknown) {
      setScanState("error");
      setErrorMsg(e instanceof Error ? e.message : "Unknown error");
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[hsl(var(--surface-light))] text-foreground min-h-[760px] md:min-h-[860px]">
      <img
        src={heroImg}
        alt="Glowing translucent cube of neural filaments"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="relative z-10 mx-auto flex h-full max-w-[1200px] flex-col items-center px-6 pt-24 md:pt-28 text-center"
        style={{ minHeight: "inherit" }}
      >
        <p className="subhead text-xs uppercase tracking-[0.2em] mb-5 opacity-60">
          Portus · LLM Migration Assistant
        </p>
        <h1 className="display-headline text-[52px] md:text-[88px] lg:text-[112px] max-w-[14ch] animate-fade-up">
          Find every closed-source call.
        </h1>
        <p className="subhead mt-5 text-lg md:text-2xl max-w-[36ch] opacity-90">
          Drop a folder or a script. We scan with Mistral 7B and recommend an open Hugging Face model for each call.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => dirRef.current?.click()}
            className="pill-solid"
            disabled={scanState === "scanning"}
          >
            <FolderOpen className="!h-4 !w-4" /> Choose folder
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="pill-ghost"
            disabled={scanState === "scanning"}
          >
            <FileCode2 className="!h-4 !w-4" /> Upload script ›
          </button>
        </div>

        {picked && scanState !== "scanning" && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 backdrop-blur px-4 py-1.5 text-sm">
              <Upload className="h-3.5 w-3.5" /> {picked}
            </div>
            <button onClick={handleScan} className="pill-solid text-base px-6 py-2">
              Scan now →
            </button>
          </div>
        )}

        {scanState === "scanning" && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 backdrop-blur px-5 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Scanning with Mistral 7B…
          </div>
        )}

        {scanState === "error" && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-4 py-1.5 text-sm text-destructive">
            <AlertCircle className="h-3.5 w-3.5" />
            {errorMsg || "Scan failed — is the backend running?"}
          </div>
        )}

        {/* hidden inputs */}
        <input
          ref={dirRef}
          type="file"
          // @ts-expect-error - non-standard but widely supported
          webkitdirectory=""
          directory=""
          multiple
          className="hidden"
          onChange={onDir}
        />
        <input
          ref={fileRef}
          type="file"
          accept=".py,.js,.ts,.tsx,.jsx,.rb,.go,.java,.txt,.md"
          className="hidden"
          onChange={onFile}
        />
      </div>
    </section>
  );
};
