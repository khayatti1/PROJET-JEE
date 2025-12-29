"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  idProduit?: number
}

interface EditCommandeDialogProps {
  commande: Commande
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditCommandeDialog({ commande, open, onOpenChange, onSuccess }: EditCommandeDialogProps) {
  const [description, setDescription] = useState(commande.description)
  const [quantite, setQuantite] = useState(commande.quantite.toString())
  const [montant, setMontant] = useState(commande.montant.toString())
  const [idProduit, setIdProduit] = useState(commande.idProduit?.toString() || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [produits, setProduits] = useState<Produit[]>([])
  const [loadingProduits, setLoadingProduits] = useState(false)

  useEffect(() => {
    if (open) {
      setDescription(commande.description)
      setQuantite(commande.quantite.toString())
      setMontant(commande.montant.toString())
      setIdProduit(commande.idProduit?.toString() || "")
      console.log("[v0] Dialog opened with idProduit:", commande.idProduit)
      fetchProduits()
    }
  }, [open, commande])

  const fetchProduits = async () => {
    try {
      setLoadingProduits(true)
      const response = await fetch("http://localhost:9001/produits")
      if (!response.ok) throw new Error("Erreur lors du chargement des produits")
      const data = await response.json()
      setProduits(data)
      console.log("[v0] Loaded products:", data)
    } catch (err) {
      console.error("[v0] Error fetching products:", err)
      alert("Erreur lors du chargement des produits")
    } finally {
      setLoadingProduits(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idProduit) {
      alert("Veuillez sélectionner un produit")
      return
    }

    setIsSubmitting(true)

    try {
      const body = {
        id: commande.id,
        description,
        quantite: Number.parseInt(quantite),
        date: commande.date,
        montant: Number.parseFloat(montant),
        idProduit: Number.parseInt(idProduit),
      }

      console.log("[v0] ===== UPDATE COMMANDE DEBUG =====")
      console.log("[v0] Original commande:", commande)
      console.log("[v0] Selected idProduit (string):", idProduit)
      console.log("[v0] Selected idProduit (parsed):", Number.parseInt(idProduit))
      console.log("[v0] Full request body:", JSON.stringify(body, null, 2))
      console.log("[v0] PUT URL:", `http://localhost:8081/commandes/${commande.id}`)

      const response = await fetch(`http://localhost:8081/commandes/${commande.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response ok:", response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Server error response:", errorText)
        throw new Error("Erreur lors de la modification de la commande")
      }

      const result = await response.json()
      console.log("[v0] Server returned data:", result)
      console.log("[v0] Server returned idProduit:", result.idProduit)
      console.log("[v0] ===== END UPDATE DEBUG =====")

      onOpenChange(false)

      setTimeout(() => {
        onSuccess()
      }, 300)
    } catch (err) {
      console.error("[v0] Error updating commande:", err)
      alert(err instanceof Error ? err.message : "Erreur lors de la modification")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleProductChange = (value: string) => {
    console.log("[v0] Product selection changed to:", value)
    setIdProduit(value)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la Commande</DialogTitle>
          <DialogDescription>Modifiez les informations de la commande (ID: {commande.id})</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-quantite">Quantité</Label>
              <Input
                id="edit-quantite"
                type="number"
                min="1"
                value={quantite}
                onChange={(e) => setQuantite(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-montant">Montant (€)</Label>
              <Input
                id="edit-montant"
                type="number"
                step="0.01"
                min="0"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-idProduit">Produit</Label>
              {loadingProduits ? (
                <div className="text-sm text-muted-foreground">Chargement des produits...</div>
              ) : produits.length === 0 ? (
                <div className="text-sm text-destructive">Aucun produit disponible</div>
              ) : (
                <Select value={idProduit} onValueChange={handleProductChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un produit" />
                  </SelectTrigger>
                  <SelectContent>
                    {produits.map((produit) => (
                      <SelectItem key={produit.id} value={produit.id.toString()}>
                        {produit.nom} (ID: {produit.id}) - {produit.prix.toFixed(2)} €
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <div className="text-xs text-muted-foreground">ID Produit sélectionné : {idProduit || "Aucun"}</div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || produits.length === 0 || !idProduit}>
              {isSubmitting ? "Modification..." : "Modifier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
