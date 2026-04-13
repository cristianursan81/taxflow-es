import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function EngagementModelsSection() {
  const models = [
    {
      title: "Proyecto Completo",
      description: "Desarrollo integral desde la conceptualización hasta el despliegue",
      features: ["Análisis de requerimientos", "Diseño UX/UI", "Desarrollo completo", "Testing y QA", "Despliegue y soporte"],
      icon: "🚀",
      gradient: "from-blue-500 to-purple-600",
      bgGradient: "from-white via-blue-50/30 to-purple-50/30",
      ringGradient: "from-blue-200 to-purple-200",
      textGradient: "from-blue-700 to-purple-700",
      iconColor: "text-blue-600"
    },
    {
      title: "Equipo Dedicado",
      description: "Team completo trabajando exclusivamente en tu proyecto",
      features: ["Desarrolladores seniors", "Project manager dedicado", "Comunicación directa", "Flexibilidad total", "Escalabilidad rápida"],
      icon: "👥",
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-white via-emerald-50/30 to-teal-50/30",
      ringGradient: "from-emerald-200 to-teal-200",
      textGradient: "from-emerald-700 to-teal-700",
      iconColor: "text-emerald-600"
    },
    {
      title: "Staff Augmentation",
      description: "Refuerza tu equipo con nuestros especialistas",
      features: ["Integración inmediata", "Expertos por especialidad", "Colaboración fluida", "Control total del proyecto", "Costos optimizados"],
      icon: "⚡",
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-white via-orange-50/30 to-red-50/30",
      ringGradient: "from-orange-200 to-red-200",
      textGradient: "from-orange-700 to-red-700",
      iconColor: "text-orange-600"
    }
  ]

  return (
    <section className="py-20 px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-gray-50/50" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-slate-700 to-gray-700 bg-clip-text text-transparent">
            Modelos de Colaboración
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Adaptamos nuestra forma de trabajo a las necesidades específicas de tu negocio
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {models.map((model, index) => (
            <Card key={index} className={`group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br ${model.bgGradient} ring-2 ring-gradient-to-r ${model.ringGradient}`}>
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {model.icon}
                </div>
                <CardTitle className={`text-xl font-bold bg-gradient-to-r ${model.textGradient} bg-clip-text text-transparent`}>
                  {model.title}
                </CardTitle>
                <CardDescription className="text-slate-600 text-sm">
                  {model.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {model.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <span className={`${model.iconColor} mr-3 text-lg`}>✓</span>
                      <span className="text-slate-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}