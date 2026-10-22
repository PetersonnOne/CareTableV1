import Link from "next/link";
export default function NotFound() {
  return (
    <div className="page narrow">
      <span className="eyebrow">A DIFFERENT PLACE AT THE TABLE</span>
      <h1>Page not found.</h1>
      <p>This address does not lead to a CareTable page.</p>
      <Link className="button" href="/">
        Back home
      </Link>
    </div>
  );
}
