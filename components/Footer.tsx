const LINKS = [
  { href: "#intelligence", label: "Intelligence" },
  { href: "#ecosystem", label: "Network" },
  { href: "#exchange", label: "Exchange" },
  { href: "#forums", label: "Forums" },
  { href: "#policy", label: "Policy" },
  { href: "#studio", label: "Studio" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">AmplifImpact</span>
          <span className="footer-tag">People · Ideas · Systems</span>
        </div>
        <p className="footer-line">
          The world doesn&apos;t need more noise. It needs more impact to
          travel.
        </p>
        <div className="footer-bottom">
          <span>© 2027 AmplifImpact</span>
          <div className="footer-links">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
