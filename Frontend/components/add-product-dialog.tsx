"use client"

import type React from "react"

import { useState } from "react"
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

interface AddProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddProductDialog({ open, onOpenChange, onSuccess }: AddProductDialogProps) {
  const [nom, setNom] = useState("")
  const [prix, setPrix] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("http://localhost:9001/produits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom,
          prix: Number.parseFloat(prix),
        }),
      })

      if (!response.ok) throw new Error("Erreur lors de l'ajout du produit")

      setNom("")
      setPrix("")
      onOpenChange(false)
      onSuccess()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de l'ajout")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau Produit</DialogTitle>
          <DialogDescription>Ajoutez un nouveau produit au catalogue</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom du produit</Label>
              <Input
                id="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex: Ordinateur portable"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prix">Prix (€)</Label>
              <Input
                id="prix"
                type="number"
                step="0.01"
                min="0"
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Ajout..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
