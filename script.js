const grid = document.getElementById("recipe-grid");
const filterButtons = document.querySelectorAll(".continent-filters button");
const searchInput = document.querySelector(".search-form input");

let allMeals = [];

// ✅ Manually added Nigerian meals with correct image paths
const customNigerianMeals = [
  {
    id: 1001,
    title: "Jollof Rice",
    image: "images/jellof-rice.jpg",
    continent: "Africa",
    instructions: "Cook tomatoes, peppers, and onions into a base. Add stock and parboiled rice. Simmer until tender.",
    ingredients: ["2 cups parboiled rice", "1 cup blended tomato mix", "1/4 cup vegetable oil", "1 tsp thyme", "2 cups chicken stock"]
  },
  {
    id: 1002,
    title: "Egusi Soup",
    image: "images/egusi (1).jpg",
    continent: "Africa",
    instructions: "Fry egusi in palm oil, add stock and assorted meats. Simmer with vegetables.",
    ingredients: ["1 cup ground egusi", "1/2 cup palm oil", "2 cups assorted meats", "1 cup spinach", "2 seasoning cubes"]
  },
  {
    id: 1003,
    title: "Moi Moi",
    image: "images/moi-moi.jpg",
    continent: "Africa",
    instructions: "Blend beans with pepper and onions, mix with oil and seasoning. Steam until set.",
    ingredients: ["2 cups peeled beans", "1 red bell pepper", "1/4 cup vegetable oil", "1 onion", "2 seasoning cubes"]
  }

   
];

// ✅ Fetch and categorize meals
async function loadMeals(region) {
  grid.innerHTML = "<p>Loading recipes...</p>";
  let meals = region === "Africa" ? [...customNigerianMeals] : [];

  const res = await fetch("https://dummyjson.com/recipes");
  const data = await res.json();

  let fetched = data.recipes.map(meal => ({
    ...meal,
    continent: getContinentByMeal(meal)
  }));

  if (region !== "All") {
    fetched = fetched.filter(meal => meal.continent === region);
  }

  if (region === "Africa") {
    meals = [...meals, ...fetched];
  } else {
    meals = region === "All" ? [...customNigerianMeals, ...fetched] : fetched;
  }

  allMeals = meals;
  grid.innerHTML = renderCards(meals);
}

// ✅ Assign continent based on recipe tags
function getContinentByMeal(meal) {
  const europe = ["Italian", "French", "German", "European"];
  const asia = ["Chinese", "Indian", "Thai", "Asian"];
  const africa = ["Nigerian", "African", "Moroccan"];

  const tags = meal.tags?.join(",") || (meal.name + meal.instructions);

  if (europe.some(k => tags.includes(k))) return "Europe";
  if (asia.some(k => tags.includes(k))) return "Asia";
  if (africa.some(k => tags.includes(k))) return "Africa";
  return "Europe";
}

// ✅ Render cards
function renderCards(meals) {
  return meals.map(meal => `
    <div class="card" data-continent="${meal.continent}">
      <img src="${meal.image}" 
           alt="${meal.name || meal.title}" 
           onclick="showDetails(${meal.id})" 
           onerror="this.src='images/default.jpg'" />
      <div class="card-body">
        <div class="badge">Region: ${meal.continent}</div>
        <h3>${meal.name || meal.title}</h3>
        <p class="preview-text">Click image for full recipe & ingredients</p>
        <div class="extra">
          <span>⭐ ${meal.rating || '1.9k'}</span>
          <button onclick="addFavorite('${meal.name || meal.title}')">❤️ Favorite</button>
        </div>
      </div>
    </div>
  `).join("");
}

// ✅ Show full recipe in modal
function showDetails(id) {
  const meal = allMeals.find(m => m.id === id);
  if (!meal) return;

  const ingredients = meal.ingredients || [];
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <h2>${meal.name || meal.title}</h2>
      <img src="${meal.image}" alt="${meal.name || meal.title}" onerror="this.src='images/default.jpg'" />
      <p><strong>Instructions:</strong></p>
      <p>${meal.instructions || 'No instructions available.'}</p>
      <p><strong>Ingredients:</strong></p>
      <ul>
        ${ingredients.map(i => `<li>${i}</li>`).join("")}
      </ul>
    </div>
  `;
  document.getElementById("modal-root").innerHTML = "";
  document.getElementById("modal-root").appendChild(modal);
}

// ✅ Add to favorites
function addFavorite(name) {
  alert(`${name} added to favorites!`);
}

// ✅ Filter by continent
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const continent = btn.getAttribute("data-continent");
    loadMeals(continent);
  });
});

// ✅ Search by title
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = allMeals.filter(meal =>
    (meal.title || meal.name).toLowerCase().includes(query)
  );
  grid.innerHTML = renderCards(filtered);
});

// ✅ Initial load
loadMeals("All");


// 💬 Feedback form behavior
const feedbackForm = document.getElementById("feedback-form");
const feedbackMessage = document.getElementById("feedback-message");

if (feedbackForm) {
  feedbackForm.addEventListener("submit", (e) => {
    e.preventDefault();
    feedbackMessage.classList.remove("hidden");
    feedbackForm.reset();

    setTimeout(() => {
      feedbackMessage.classList.add("hidden");
    }, 4000);
  });
}
