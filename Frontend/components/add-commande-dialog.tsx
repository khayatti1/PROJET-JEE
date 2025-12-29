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

interface AddCommandeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddCommandeDialog({ open, onOpenChange, onSuccess }: AddCommandeDialogProps) {
  const [description, setDescription] = useState("")
  const [quantite, setQuantite] = useState("")
  const [montant, setMontant] = useState("")
  const [idProduit, setIdProduit] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [produits, setProduits] = useState<Produit[]>([])
  const [loadingProduits, setLoadingProduits] = useState(false)

  useEffect(() => {
    if (open) {
      fetchProduits()
    }
  }, [open])

  const fetchProduits = async () => {
    try {
      setLoadingProduits(true)
      const response = await fetch("http://localhost:9001/produits")
      if (!response.ok) throw new Error("Erreur lors du chargement des produits")
      const data = await response.json()
      setProduits(data)
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
        description,
        quantite: Number.parseInt(quantite),
        date: new Date().toISOString().split("T")[0],
        montant: Number.parseFloat(montant),
        idProduit: Number.parseInt(idProduit),
      }

      console.log("[v0] Sending commande:", body)

      const response = await fetch("http://localhost:8081/commandes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Server error:", errorText)
        throw new Error("Erreur lors de l'ajout de la commande")
      }

      setDescription("")
      setQuantite("")
      setMontant("")
      setIdProduit("")
      onOpenChange(false)
      onSuccess()
    } catch (err) {
      console.error("[v0] Error adding commande:", err)
      alert(err instanceof Error ? err.message : "Erreur lors de l'ajout")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle Commande</DialogTitle>
          <DialogDescription>Créez une nouvelle commande</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Commande PC Portable"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantite">Quantité</Label>
              <Input
                id="quantite"
                type="number"
                min="1"
                value={quantite}
                onChange={(e) => setQuantite(e.target.value)}
                placeholder="1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="montant">Montant (€)</Label>
              <Input
                id="montant"
                type="number"
                step="0.01"
                min="0"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idProduit">Produit</Label>
              {loadingProduits ? (
                <div className="text-sm text-muted-foreground">Chargement des produits...</div>
              ) : produits.length === 0 ? (
                <div className="text-sm text-destructive">Aucun produit disponible. Ajoutez d'abord des produits.</div>
              ) : (
                <Select value={idProduit} onValueChange={setIdProduit} required>
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
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || produits.length === 0}>
              {isSubmitting ? "Création..." : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
