import { type NextRequest, NextResponse } from "next/server"
import { verifyJwt } from "@/lib/jwt"
import { sql } from "@/lib/db"

export interface Recipe {
  id: string
  name: string
  description: string
  ingredients: string[]
  instructions: string[]
  cookTime: number
  servings: number
  difficulty: "easy" | "medium" | "hard"
}

// Recipe database - in production, move this to database
const RECIPES: Recipe[] = [
  {
    id: "1",
    name: "Simple Salad",
    description: "Fresh vegetable salad with olive oil dressing",
    ingredients: ["lettuce", "tomato", "cucumber", "olive oil"],
    instructions: [
      "Wash and chop vegetables",
      "Mix vegetables in a bowl",
      "Drizzle with olive oil",
      "Season to taste and serve",
    ],
    cookTime: 10,
    servings: 2,
    difficulty: "easy",
  },
  {
    id: "2",
    name: "Vegetable Stir Fry",
    description: "Quick and healthy stir fry with seasonal vegetables",
    ingredients: ["broccoli", "carrot", "bell pepper", "onion", "garlic", "soy sauce", "oil"],
    instructions: [
      "Chop all vegetables",
      "Heat oil in wok or large pan",
      "Add garlic and onion first",
      "Add harder vegetables first, then softer ones",
      "Add soy sauce and mix",
      "Serve hot",
    ],
    cookTime: 20,
    servings: 4,
    difficulty: "easy",
  },
  {
    id: "3",
    name: "Pasta Primavera",
    description: "Pasta with fresh seasonal vegetables",
    ingredients: ["pasta", "tomato", "zucchini", "bell pepper", "garlic", "basil", "olive oil"],
    instructions: [
      "Cook pasta according to package directions",
      "Sauté garlic and vegetables",
      "Toss with cooked pasta",
      "Add basil and olive oil",
      "Season and serve",
    ],
    cookTime: 25,
    servings: 4,
    difficulty: "easy",
  },
  {
    id: "4",
    name: "Tomato Soup",
    description: "Creamy tomato soup with fresh herbs",
    ingredients: ["tomato", "onion", "garlic", "cream", "basil", "salt", "pepper"],
    instructions: [
      "Chop onion and garlic",
      "Sauté onion and garlic",
      "Add tomatoes and simmer",
      "Blend until smooth",
      "Add cream and basil",
      "Season to taste and serve",
    ],
    cookTime: 30,
    servings: 4,
    difficulty: "easy",
  },
  {
    id: "5",
    name: "Stir Fried Rice",
    description: "Rice with vegetables and eggs",
    ingredients: ["rice", "egg", "carrot", "peas", "onion", "garlic", "soy sauce"],
    instructions: [
      "Cook rice if needed",
      "Beat eggs in a bowl",
      "Heat oil and scramble eggs, set aside",
      "Stir fry vegetables with garlic",
      "Add rice and soy sauce",
      "Mix in eggs and serve",
    ],
    cookTime: 20,
    servings: 3,
    difficulty: "easy",
  },
  {
    id: "6",
    name: "Roasted Vegetables",
    description: "Oven-roasted seasonal vegetables",
    ingredients: ["broccoli", "carrot", "bell pepper", "zucchini", "olive oil", "garlic"],
    instructions: [
      "Chop vegetables into bite-sized pieces",
      "Toss with olive oil and garlic",
      "Spread on baking sheet",
      "Roast at 425°F for 20-25 minutes",
      "Serve hot",
    ],
    cookTime: 30,
    servings: 4,
    difficulty: "easy",
  },
  {
    id: "7",
    name: "Egg Fried Rice",
    description: "Simple egg fried rice",
    ingredients: ["rice", "egg", "onion", "soy sauce", "oil"],
    instructions: [
      "Heat oil in pan",
      "Scramble eggs and set aside",
      "Fry onion, add rice",
      "Add soy sauce and eggs",
      "Mix well and serve",
    ],
    cookTime: 15,
    servings: 2,
    difficulty: "easy",
  },
  {
    id: "8",
    name: "Garlic Bread",
    description: "Crispy garlic bread",
    ingredients: ["bread", "garlic", "butter", "parsley"],
    instructions: [
      "Mix softened butter with minced garlic",
      "Slice bread lengthwise",
      "Spread garlic butter on bread",
      "Bake at 375°F for 8-10 minutes",
      "Garnish with parsley and serve",
    ],
    cookTime: 15,
    servings: 4,
    difficulty: "easy",
  },
]

function normalizeIngredient(ingredient: string): string {
  return ingredient.toLowerCase().trim()
}

function calculateMatchPercentage(recipeIngredients: string[], userIngredients: string[]): number {
  const normalizedUserIngredients = userIngredients.map(normalizeIngredient)
  const matchCount = recipeIngredients.filter((ing) =>
    normalizedUserIngredients.some((userIng) => userIng.includes(normalizeIngredient(ing))),
  ).length

  return (matchCount / recipeIngredients.length) * 100
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyJwt(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Get user's items
    const items = await sql`
      SELECT DISTINCT LOWER(name) as ingredient
      FROM items
      WHERE user_id = ${payload.userId as number}
    `

    const userIngredients = (items as Array<{ ingredient: string }>).map((item) => item.ingredient)

    if (userIngredients.length === 0) {
      return NextResponse.json({
        recipes: [],
        userIngredients: [],
        message: "Add items to get recipe suggestions",
      })
    }

    // Filter recipes that match at least 50% of ingredients
    const matchedRecipes = RECIPES.map((recipe) => ({
      ...recipe,
      matchPercentage: calculateMatchPercentage(recipe.ingredients, userIngredients),
      matchedIngredients: recipe.ingredients.filter((ing) =>
        userIngredients.some((userIng) => userIng.includes(normalizeIngredient(ing))),
      ),
    }))
      .filter((recipe) => recipe.matchPercentage >= 50)
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 6) // Return top 6 recipes

    return NextResponse.json({
      recipes: matchedRecipes,
      userIngredients,
      total: matchedRecipes.length,
    })
  } catch (error) {
    console.error("Error fetching recipes:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
