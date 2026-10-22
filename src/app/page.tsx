import Link from "next/link";
export default function Home() {
  return (
    <div className="home">
      <section className="home-hero">
        <div>
          <span className="eyebrow">GOOD FOOD. FAMILIAR FEELINGS.</span>
          <h1>
            A little more care
            <br />
            at every <em>meal.</em>
          </h1>
          <p className="lead">
            Thoughtful meal plans shaped around the people you love—their
            tastes, their traditions, and their everyday needs.
          </p>
          <div className="actions">
            <Link className="button" href="/planner">
              Find your place at the table <span>↗</span>
            </Link>
            <Link className="button outline" href="/planner?sample=1">
              Try a fictional sample
            </Link>
          </div>
          <p className="fine">For individuals, partners, and families.</p>
        </div>
        <div className="table-illustration" aria-hidden="true">
          <div className="table-ring" />
          <div className="table-plate">
            <div className="greens" />
            <div className="grains" />
            <div className="carrots" />
            <span className="leaf">❧</span>
          </div>
          <div className="little-note">
            <span>♡</span>
            <div>
              Made around your people
              <small>A thoughtful plan starts with listening.</small>
            </div>
          </div>
        </div>
      </section>
      <section className="values-grid">
        <article>
          <span>01 / PERSONAL</span>
          <h2>Start with what they love.</h2>
          <p>
            Make room for the familiar foods and preferences that make a meal
            feel like home.
          </p>
        </article>
        <article>
          <span>02 / THOUGHTFUL</span>
          <h2>Keep their needs in view.</h2>
          <p>
            Give each person's ingredients, preparation preferences, and
            practical needs their own space.
          </p>
        </article>
        <article>
          <span>03 / ADAPTABLE</span>
          <h2>Leave room for a better fit.</h2>
          <p>
            A meal plan should listen, learn from feedback, and change with your
            household.
          </p>
        </article>
      </section>
    </div>
  );
}
