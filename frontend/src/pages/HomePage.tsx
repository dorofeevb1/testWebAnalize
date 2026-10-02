import AuditForm from "../components/audit/AuditForm";
import "./HomePage.scss";

function HomePage() {
  return (
    <main className="page">
      <div className="content">
        <h1 className="title">Web Audit</h1>

        <p className="description">
          Technical audit of a public website for performance, SEO,
          accessibility, security and best practices.
        </p>

        <AuditForm />
      </div>
    </main>
  );
}

export default HomePage;
