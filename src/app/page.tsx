import Link from "next/link";
import { MealCarousel } from "@/components/meal-carousel";
export default function Home() {
  return (
    <div className="home">
      <section className="home-hero">
        <div>
          <span className="eyebrow home-kicker"><span aria-hidden="true">♡</span> GOOD FOOD. FAMILIAR FEELINGS.</span>
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
        <MealCarousel />
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
      <section className="home-journey" aria-labelledby="home-journey-title">
        <span className="eyebrow">A LITTLE CARE, ONE STEP AT A TIME</span>
        <h2 id="home-journey-title">Less wondering. More looking forward.</h2>
        <p>No need to figure everything out at once. Start with your people, and take it from there.</p>
        <ol>{[["Your table","Make space for each person’s favourites and needs."],["Plan your meals","Find a rhythm that fits your time and budget."],["Review together","Explore your meals, ingredients and checks."],["Make it more yours","Reflect, chat, or talk through a change with AI."]].map(([title,copy],i)=><li key={title}><span aria-hidden="true">{i+1}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
        <Link className="button" href="/planner">Let’s set your table <span aria-hidden="true">→</span></Link>
      </section>
    </div>
  );
}
