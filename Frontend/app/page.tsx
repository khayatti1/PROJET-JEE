import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Server, Package, ShoppingCart, Activity, Shield, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm font-medium">
              <Activity className="w-4 h-4 text-chart-1" />
              Spring Cloud Microservices Architecture
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
              Gestion Distribuée
              <span className="block text-muted-foreground">Produits & Commandes</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Architecture microservices moderne avec Spring Cloud, Eureka Discovery, Config Server et API Gateway pour
              une gestion scalable et résiliente
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button asChild size="lg" className="text-lg h-12 px-8">
                <Link href="/produits">
                  <Package className="w-5 h-5 mr-2" />
                  Gérer les Produits
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg h-12 px-8 bg-transparent">
                <Link href="/commandes">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Gérer les Commandes
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 border-2 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-chart-1/10 flex items-center justify-center mb-4">
              <Server className="w-6 h-6 text-chart-1" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Config Server</h3>
            <p className="text-muted-foreground mb-4">
              Configuration centralisée externalisée via GitHub pour tous les microservices
            </p>
            <div className="text-sm text-muted-foreground font-mono bg-muted px-3 py-2 rounded">Port 9101</div>
          </Card>

          <Card className="p-6 border-2 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-chart-2" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Eureka Discovery</h3>
            <p className="text-muted-foreground mb-4">
              Service registry pour la découverte dynamique des microservices
            </p>
            <div className="text-sm text-muted-foreground font-mono bg-muted px-3 py-2 rounded">Port 9102</div>
          </Card>

          <Card className="p-6 border-2 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-chart-3" />
            </div>
            <h3 className="text-xl font-semibold mb-2">API Gateway</h3>
            <p className="text-muted-foreground mb-4">Point d'entrée unique avec load balancing et circuit breaker</p>
            <div className="text-sm text-muted-foreground font-mono bg-muted px-3 py-2 rounded">Port 9103</div>
          </Card>

          <Card className="p-6 border-2 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-chart-4/10 flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-chart-4" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Microservice Produits</h3>
            <p className="text-muted-foreground mb-4">Gestion CRUD des produits avec base de données H2</p>
            <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
              <Link href="/produits">Accéder</Link>
            </Button>
          </Card>

          <Card className="p-6 border-2 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-chart-5/10 flex items-center justify-center mb-4">
              <ShoppingCart className="w-6 h-6 text-chart-5" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Microservice Commandes</h3>
            <p className="text-muted-foreground mb-4">Gestion des commandes avec liaison aux produits</p>
            <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
              <Link href="/commandes">Accéder</Link>
            </Button>
          </Card>

          <Card className="p-6 border-2 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Resilience4J</h3>
            <p className="text-muted-foreground mb-4">Circuit breaker et fallback pour une architecture résiliente</p>
            <div className="text-sm text-muted-foreground font-mono bg-muted px-3 py-2 rounded">Actif</div>
          </Card>
        </div>
      </section>

      {/* Architecture Info */}
      <section className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Architecture Technique</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Technologies</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Java 17 + Spring Boot 3.x
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Spring Cloud 2024.x
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    H2 Database
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Maven
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Fonctionnalités</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Configuration externalisée
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Service Discovery
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Load Balancing
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Documentation OpenAPI
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
