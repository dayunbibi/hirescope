// Displays the global website footer
export default function Footer() {
  return (
    <footer className="mt-14 flex flex-col gap-3 border-t border-hairline px-4 py-[22px] font-mono text-[13px] text-muted sm:flex-row sm:justify-between md:px-12">
      <p>Sources: Greenhouse, Lever, RemoteOK, Jobicy</p>

      <a
        href="https://github.com/dayunbibi/hirescope"
        target="_blank"
        rel="noreferrer"
        className="hover:underline focus-visible:outline-2 focus-visible:outline-ink"
      >
        GitHub
      </a>
    </footer>
  );
}
