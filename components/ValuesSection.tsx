import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ValuesSection() {
  const values = [
    {
      title: "Excelencia Técnica",
      description: "Código limpio, arquitectura sólida y mejores prácticas en cada proyecto",
      icon: "⚡",
      gradient: "from-yellow-500 to-orange-600",
      bgGradient: "from-white via-yellow-50/30 to-orange-50/30",
      ringGradient: "from-yellow-200 to-orange-200",
      textGradient: "from-yellow-700 to-orange-700",
      iconColor: "text-yellow-600"
    },
    {
      title: "Transparencia Total",
      description: "Comunicación clara, reportes constantes y total visibilidad del progreso",
      icon: "👁️",
      gradient: "from-cyan-500 to-blue-600",
      bgGradient: "from-white via-cyan-50/30 to-blue-50/30", 
      ringGradient: "from-cyan-200 to-blue-200",
      textGradient: "from-cyan-700 to-blue-700",
      iconColor: "text-cyan-600"
    },
    {
      title: "Innovación Constante",
      description: "Siempre a la vanguardia tecnológica para ofrecer ventajas competitivas",
      icon: "🚀",
      gradient: "from-purple-500 to-indigo-600",
      bgGradient: "from-white via-purple-50/30 to-indigo-50/30",
      ringGradient: "from-purple-200 to-indigo-200", 
      textGradient: "from-purple-700 to-indigo-700",
      iconColor: "text-purple-600"
    },
    {
      title: "Compromiso",
      description: "Tu éxito es nuestro éxito. Nos involucramos como parte de tu equipo",
      icon: "🤝",
      gradient: "from-emerald-500 to-green-600",
      bgGradient: "from-white via-emerald-50/30 to-green-50/30",
      ringGradient: "from-emerald-200 to-green-200",
      textGradient: "from-emerald-700 to-green-700", 
      iconColor: "text-emerald-600"
    },
    {
      title: "Agilidad",
      description: "Desarrollo iterativo y adaptable a cambios, priorizando la entrega de valor",
      icon: "⚡",
      gradient: "from-pink-500 to-rose-600",
      bgGradient: "from-white via-pink-50/30 to-rose-50/30",
      ringGradient: "from-pink-200 to-rose-200",
      textGradient: "from-pink-700 to-rose-700",
      iconColor: "text-pink-600"
    },
    {
      title: "Escalabilidad",
      description: "Soluciones preparadas para crecer junto a tu negocio sin limitaciones",
      icon: "📈",
      gradient: "from-teal-500 to-cyan-600", 
      bgGradient: "from-white via-teal-50/30 to-cyan-50/30",
      ringGradient: "from-teal-200 to-cyan-200",
      textGradient: "from-teal-700 to-cyan-700",
      iconColor: "text-teal-600"
    }
  ]

  return (
    <section className="py-20 px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-purple-50/50" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Nuestros Valores
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Los principios que guían cada decisión y nos distinguen en el mercado
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card key={index} className={`group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br ${value.bgGradient} ring-2 ring-gradient-to-r ${value.ringGradient}`}>
              <CardHeader className="text-center pb-3">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <CardTitle className={`text-lg font-bold bg-gradient-to-r ${value.textGradient} bg-clip-text text-transparent`}>
                  {value.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 text-sm text-center leading-relaxed">
                  {value.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}