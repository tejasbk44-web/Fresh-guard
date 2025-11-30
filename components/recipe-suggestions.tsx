"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface RecipeSuggestion {
  id: string
  name: string
  description: string
  ingredients: string[]
  instructions: string[]
  cookTime: number
  servings: number
  difficulty: "easy" | "medium" | "hard"
  matchPercentage: number
  matchedIngredients: string[]
}

export function RecipeSuggestions() {
  const [recipes, setRecipes] = useState<RecipeSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("/api/recipes")
        if (!response.ok) {
          throw new Error("Failed to fetch recipes")
        }
        const data = await response.json()
        setRecipes(data.recipes || [])
      } catch (err) {
        console.error("Error fetching recipes:", err)
        setError("Failed to load recipes")
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-emerald-100 text-emerald-800"
      case "medium":
        return "bg-amber-100 text-amber-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recipe Suggestions</h2>
        <div className="flex justify-center py-12">
          <div className="text-gray-500">Loading recipes...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recipe Suggestions</h2>
        <div className="text-center py-12 text-red-600">{error}</div>
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recipe Suggestions</h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍳</div>
          <p className="text-gray-600 text-lg">No recipe suggestions yet.</p>
          <p className="text-gray-500 mt-2">Add more items or ingredients to see suggestions here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recipe Suggestions</h2>
        <span className="text-sm bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
          {recipes.length} recipe{recipes.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all"
          >
            {/* Recipe Header */}
            <div className="mb-3">
              <h3 className="font-semibold text-gray-900 text-lg mb-2">{recipe.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
            </div>

            {/* Match Percentage */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">Ingredient Match</span>
                <span className="text-xs font-bold text-emerald-600">{recipe.matchPercentage.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${recipe.matchPercentage}%` }}
                />
              </div>
            </div>

            {/* Recipe Info */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="text-xs">
                <span className="block text-gray-600">⏱️ Time</span>
                <span className="font-semibold text-gray-900">{recipe.cookTime}m</span>
              </div>
              <div className="text-xs">
                <span className="block text-gray-600">🍽️ Serves</span>
                <span className="font-semibold text-gray-900">{recipe.servings}</span>
              </div>
              <div className="text-xs">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                  {recipe.difficulty}
                </span>
              </div>
            </div>

            {/* Matched Ingredients */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-700 mb-2">You have:</p>
              <div className="flex flex-wrap gap-1">
                {recipe.matchedIngredients.slice(0, 3).map((ing) => (
                  <span key={ing} className="inline-block bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs">
                    {ing}
                  </span>
                ))}
                {recipe.matchedIngredients.length > 3 && (
                  <span className="inline-block bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs">
                    +{recipe.matchedIngredients.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* View Recipe Button */}
            <button
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              onClick={() => {
                // In a real app, this could open a modal or navigate to a recipe detail page
                alert(`${recipe.name}\n\nIngredients:\n${recipe.ingredients.join(", ")}\n\nInstructions:\n${recipe.instructions.join("\n")}`)
              }}
            >
              View Recipe
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
