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

interface Product {
  id: number
  nom: string
  prix: number
}

interface EditProductDialogProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditProductDialog({ product, open, onOpenChange, onSuccess }: EditProductDialogProps) {
  const [nom, setNom] = useState(product.nom)
  const [prix, setPrix] = useState(product.prix.toString())
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setNom(product.nom)
    setPrix(product.prix.toString())
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`http://localhost:9001/produits/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: product.id,
          nom,
          prix: Number.parseFloat(prix),
        }),
      })

      if (!response.ok) throw new Error("Erreur lors de la modification du produit")

      onOpenChange(false)
      onSuccess()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de la modification")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le Produit</DialogTitle>
          <DialogDescription>Modifiez les informations du produit (ID: {product.id})</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nom">Nom du produit</Label>
              <Input id="edit-nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-prix">Prix (€)</Label>
              <Input
                id="edit-prix"
                type="number"
                step="0.01"
                min="0"
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Modification..." : "Modifier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
