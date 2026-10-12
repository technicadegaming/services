import type { CSSProperties } from 'react';

const packages = [
  { title: 'Technology troubleshooting', detail: 'Computer and device issues, setup, software or electronics questions.' },
  { title: 'Custom parts and repairs', detail: 'Broken plastic parts, useful brackets, small repair or 3D-print requests.' },
  { title: 'Arcade and custom workflows', detail: 'Redemption systems, equipment problems, game builds or small software automations.' },
];

export default function Page() {
  const link: CSSProperties = { color: '#a9f4d8', textUnderlineOffset: 4 };
  const button: CSSProperties = { display: 'inline-flex', padding: '13px 18px', borderRadius: 12, fontWeight: 750, color: '#fff', textDecoration: 'none', background: 'linear-gradient(120deg,#7357e2,#25836d)' };
  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '22px 20px 70px' }}>
      <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '12px 0 30px' }}>
        <a href="https://technicade.tech/" style={{ fontWeight: 800, color: '#fff', fontSize: 19, textDecoration: 'none' }}>◈ Technicade</a>
        <nav aria-label="Technicade navigation" style={{ display: 'flex', flexWrap: 'wrap', gap: 18, fontSize: 14 }}>
          <a href="https://technicade.tech/services.html" style={link}>All services</a>
          <a href="https://technicade.tech/products.html" style={link}>Software &amp; Tools</a>
          <a href="https://technicade.tech/#quote" style={link}>Request help</a>
        </nav>
      </header>

      <section style={{ padding: '50px 0 34px' }}>
        <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.13em', color: '#88e8ca', textTransform: 'uppercase' }}>Services · Wausau, Wisconsin</p>
        <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4.4rem)', lineHeight: 1.06, letterSpacing: '-0.04em', maxWidth: 820, margin: '14px 0 20px' }}>Have a problem that doesn't fit a package? Tell us what you need.</h1>
        <p style={{ color: '#cad4e2', fontSize: 19, maxWidth: 720, lineHeight: 1.65 }}>
          Technicade works on practical technology problems, small repairs, custom parts, arcade systems and useful software.
          Describe the outcome you're looking for—we'll review the request before agreeing on scope, availability and price.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 15, marginTop: 26 }}>
          <a href="https://technicade.tech/services.html#quote" style={button}>Describe your problem →</a>
          <a href="https://technicade.tech/services.html#packages" style={link}>See service options ↗</a>
        </div>
        <p style={{ color: '#aebdd1', fontSize: 13, marginTop: 16 }}>No payment or account is required to ask. Submitting an inquiry is not a guarantee of service.</p>
      </section>

      <section aria-labelledby="examples-heading" style={{ padding: '25px 0' }}>
        <h2 id="examples-heading" style={{ fontSize: 27, marginBottom: 16 }}>You can start with almost any question.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(235px,1fr))', gap: 14 }}>
          {packages.map((item) => (
            <article key={item.title} style={{ border: '1px solid #34445d', background: '#152339', borderRadius: 17, padding: 23 }}>
              <h3 style={{ fontSize: 17, margin: '0 0 10px' }}>{item.title}</h3>
              <p style={{ margin: 0, color: '#c0cee0', lineHeight: 1.6 }}>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="how-heading" style={{ marginTop: 28, border: '1px solid #40516e', background: '#152239', borderRadius: 18, padding: '24px 26px' }}>
        <h2 id="how-heading" style={{ fontSize: 24, margin: '0 0 8px' }}>What happens after you reach out?</h2>
        <p style={{ color: '#c4d0df', maxWidth: 760, lineHeight: 1.65 }}>
          Send a description and, if useful, a reference link. We'll review whether it's a good fit,
          ask for any missing details and explain pricing before work begins.
          For now, requests are handled through the Technicade website and support email.
        </p>
        <p style={{ color: '#aebdd1', fontSize: 13, marginBottom: 0 }}>
          Please do not send passwords or sensitive personal records. Remote-control support and an online ticket inbox are not currently offered.
        </p>
      </section>

      <footer style={{ borderTop: '1px solid #34445d', paddingTop: 24, marginTop: 45, color: '#c2cedb', fontSize: 14, display: 'flex', flexWrap: 'wrap', gap: 18 }}>
        <a href="mailto:support@technicade.tech" style={link}>support@technicade.tech</a>
        <a href="https://technicade.tech/privacy.html" style={link}>Privacy</a>
        <a href="https://technicade.tech/terms.html" style={link}>Terms</a>
        <a href="https://technicade.tech/service-policy.html" style={link}>Service policy</a>
        <span>Technicade · Wausau, Wisconsin</span>
      </footer>
    </main>
  );
}
