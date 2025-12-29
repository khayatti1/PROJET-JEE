"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, ShoppingCart, Trash2, Edit, Calendar, Package } from "lucide-react"
import { AddCommandeDialog } from "@/components/add-commande-dialog"
import { EditCommandeDialog } from "@/components/edit-commande-dialog"

interface Commande {
  id: number
  description: string
  quantite: number
  date: string
  montant: number
  idProduit?: number // Changed from id_produit to idProduit
}

interface Produit {
  id: number
  nom: string
  prix: number
}

export default function CommandesPage() {
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCommande, setEditingCommande] = useState<Commande | null>(null)
  const [produits, setProduits] = useState<Produit[]>([]) // Added state to store products

  const fetchProduits = async () => {
    try {
      const response = await fetch("http://localhost:9001/produits")
      if (!response.ok) throw new Error("Erreur lors du chargement des produits")
      const data = await response.json()
      setProduits(data)
      console.log("[v0] Products refreshed:", data)
    } catch (err) {
      console.error("[v0] Error fetching products:", err)
    }
  }

  const fetchCommandes = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8081/commandes")
      if (!response.ok) throw new Error("Erreur lors du chargement des commandes")
      const data = await response.json()
      setCommandes(data)
      setError(null)
      console.log("[v0] Commandes refreshed:", data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    console.log("[v0] ===== REFRESH START =====")
    await fetchCommandes()
    await fetchProduits()
    console.log("[v0] ===== REFRESH COMPLETE =====")
    console.log("[v0] Total commandes:", commandes.length)
    console.log("[v0] Total produits:", produits.length)
  }

  useEffect(() => {
    fetchCommandes()
    fetchProduits() // Fetch products on mount
  }, [])

  const getProduitDetails = (idProduit?: number) => {
    if (!idProduit) return null
    return produits.find((p) => p.id === idProduit)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) return

    try {
      console.log("[v0] Deleting commande with ID:", id)
      const response = await fetch(`http://localhost:8081/commandes/${id}`, {
        method: "DELETE",
      })

      console.log("[v0] Delete response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Delete error:", errorText)
        throw new Error("Erreur lors de la suppression")
      }

      await fetchCommandes()
    } catch (err) {
      console.error("[v0] Error in handleDelete:", err)
      alert(err instanceof Error ? err.message : "Erreur lors de la suppression")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-chart-5" />
              Gestion des Commandes
            </h1>
            <p className="text-muted-foreground mt-2">Microservice Commandes - Port 8081</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Nouvelle Commande
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Commandes</CardDescription>
              <CardTitle className="text-3xl">{commandes.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Montant Total</CardDescription>
              <CardTitle className="text-3xl">
                {commandes.reduce((sum, c) => sum + c.montant, 0).toFixed(2)} €
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Quantité Totale</CardDescription>
              <CardTitle className="text-3xl">{commandes.reduce((sum, c) => sum + c.quantite, 0)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Montant Moyen</CardDescription>
              <CardTitle className="text-3xl">
                {commandes.length > 0
                  ? (commandes.reduce((sum, c) => sum + c.montant, 0) / commandes.length).toFixed(2)
                  : "0.00"}{" "}
                €
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Content */}
        {loading ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Chargement des commandes...
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="border-destructive">
            <CardContent className="py-16 text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={fetchCommandes}>Réessayer</Button>
            </CardContent>
          </Card>
        ) : commandes.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-xl font-medium mb-2">Aucune commande</p>
              <p className="text-muted-foreground mb-6">Commencez par ajouter votre première commande</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Ajouter une Commande
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {commandes.map((commande) => {
              const produit = getProduitDetails(commande.idProduit) // Get product details
              return (
                <Card key={commande.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-chart-5/10">
                        <ShoppingCart className="w-6 h-6 text-chart-5" />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-semibold">{commande.description}</h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {formatDate(commande.date)}
                            </div>
                          </div>
                          <Badge variant="secondary">ID: {commande.id}</Badge>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Quantité:</span>{" "}
                            <span className="font-semibold">{commande.quantite}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Montant:</span>{" "}
                            <span className="font-semibold text-chart-5">{commande.montant.toFixed(2)} €</span>
                          </div>
                        </div>

                        {produit ? (
                          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border">
                            <Package className="w-4 h-4 text-chart-1" />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{produit.nom}</div>
                              <div className="text-xs text-muted-foreground">
                                ID: {produit.id} • Prix unitaire: {produit.prix.toFixed(2)} €
                              </div>
                            </div>
                          </div>
                        ) : commande.idProduit ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Package className="w-4 h-4" />
                            Produit ID: {commande.idProduit} (détails non disponibles)
                          </div>
                        ) : null}
                      </div>

                      <div className="flex gap-2 md:flex-col">
                        <Button variant="outline" size="sm" onClick={() => setEditingCommande(commande)}>
                          <Edit className="w-4 h-4 md:mr-0 mr-1" />
                          <span className="md:hidden">Modifier</span>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(commande.id)}>
                          <Trash2 className="w-4 h-4 md:mr-0 mr-1" />
                          <span className="md:hidden">Supprimer</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <AddCommandeDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSuccess={handleRefresh} />

      {editingCommande && (
        <EditCommandeDialog
          commande={editingCommande}
          open={!!editingCommande}
          onOpenChange={(open) => !open && setEditingCommande(null)}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  )
}
