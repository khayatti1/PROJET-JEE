"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Package, Trash2, Edit, AlertCircle } from "lucide-react"
import { AddProductDialog } from "@/components/add-product-dialog"
import { EditProductDialog } from "@/components/edit-product-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Produit {
  id: number
  nom: string
  prix: number
}

interface Commande {
  id: number
  description: string
  quantite: number
  date: string
  montant: number
  idProduit: number | null
}

export default function ProduitsPage() {
  const [produits, setProduits] = useState<Produit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Produit | null>(null)
  const [errorDialog, setErrorDialog] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  })

  const fetchProduits = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:9001/produits")
      if (!response.ok) throw new Error("Erreur lors du chargement des produits")
      const data = await response.json()
      setProduits(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduits()
  }, [])

  // Modified handleDelete to check if product is used in any orders before deleting
  const handleDelete = async (id: number, nom: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le produit "${nom}" ?`)) return

    try {
      // Check if product is used in any orders
      const commandesResponse = await fetch("http://localhost:8081/commandes")
      if (!commandesResponse.ok) {
        throw new Error("Erreur lors de la vérification des commandes")
      }

      const commandes: Commande[] = await commandesResponse.json()
      const productUsedInOrders = commandes.filter((cmd) => cmd.idProduit === id)

      // If product is used in orders, show error dialog and don't delete
      if (productUsedInOrders.length > 0) {
        setErrorDialog({
          open: true,
          message: `Impossible de supprimer le produit "${nom}" car il est utilisé dans ${productUsedInOrders.length} commande(s). Veuillez d'abord supprimer ou modifier ces commandes.`,
        })
        return
      }

      // If not used, proceed with deletion
      const response = await fetch(`http://localhost:9001/produits/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error("Erreur lors de la suppression")
      }

      await fetchProduits()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de la suppression")
    }
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
              <Package className="w-8 h-8 text-chart-4" />
              Gestion des Produits
            </h1>
            <p className="text-muted-foreground mt-2">Microservice Produits - Port 9001 via Gateway</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Nouveau Produit
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Produits</CardDescription>
              <CardTitle className="text-3xl">{produits.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Prix Moyen</CardDescription>
              <CardTitle className="text-3xl">
                {produits.length > 0
                  ? (produits.reduce((sum, p) => sum + p.prix, 0) / produits.length).toFixed(2)
                  : "0.00"}{" "}
                €
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Valeur Totale</CardDescription>
              <CardTitle className="text-3xl">{produits.reduce((sum, p) => sum + p.prix, 0).toFixed(2)} €</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Content */}
        {loading ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Chargement des produits...
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="border-destructive">
            <CardContent className="py-16 text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={fetchProduits}>Réessayer</Button>
            </CardContent>
          </Card>
        ) : produits.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-xl font-medium mb-2">Aucun produit</p>
              <p className="text-muted-foreground mb-6">Commencez par ajouter votre premier produit</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un Produit
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {produits.map((produit) => (
              <Card key={produit.id} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{produit.nom}</CardTitle>
                      <Badge variant="secondary" className="mt-2">
                        ID: {produit.id}
                      </Badge>
                    </div>
                    <Package className="w-8 h-8 text-chart-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold text-chart-4">{produit.prix.toFixed(2)} €</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => setEditingProduct(produit)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Modifier
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(produit.id, produit.nom)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AddProductDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSuccess={fetchProduits} />

      {editingProduct && (
        <EditProductDialog
          product={editingProduct}
          open={!!editingProduct}
          onOpenChange={(open) => !open && setEditingProduct(null)}
          onSuccess={fetchProduits}
        />
      )}

      <AlertDialog open={errorDialog.open} onOpenChange={(open) => setErrorDialog({ ...errorDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Suppression impossible
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">{errorDialog.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorDialog({ open: false, message: "" })}>Compris</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
