# CareTable data and attribution

The catalog in `src/modules/meals/domain/catalog.mjs` contains 20 original prototype recipe suggestions authored for CareTable, distributed with this repository under MIT. Ingredients, preparation steps, times, tags, and servings are application data. Preparations have not been independently tested. No third-party recipe catalog was scraped or copied. Culture tags describe a loose recipe mapping and do not assert cultural authenticity.

[Qloo](https://www.qloo.com/) supplies dining/cuisine tag resolution and aggregate affinities through the hackathon API. Returned identifiers, names, scores when present, and fetch timestamps are retained in the private plan. These responses are external service data governed by Qloo's applicable terms, not relicensed as MIT by this repository. Private probe responses and provider instructions are excluded from Git. Qloo does not supply or certify the recipes.

[OpenAI Responses](https://developers.openai.com/api/docs/guides/function-calling) with GPT-6 Luna interprets optional onboarding text and selects eligible recipe IDs through a constrained function call. Summaries are model-generated. Application validation determines ingredient/practical check outcomes and may repair missing selections using existing checked recipes. The interface labels such a repair. No model output can add a new recipe to the catalog.

Recipe quantities scale by intended recipient count. Metric/imperial conversions are approximate. No regional price, nutrition, product-label, preparation safety, or inventory dataset is connected. Missing price and texture evidence remains unknown.

Fictional sample labels and needs are editable demonstration inputs. They are not records of an actual older adult or clinical care plan. Interface art is CSS/SVG authored in the project; no stock photography or external image license is required.
