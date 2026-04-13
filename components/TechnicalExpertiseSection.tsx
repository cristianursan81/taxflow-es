import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TechnicalExpertiseSection() {
  const technologies = [
    {
      category: "Frontend",
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js"],
      icon: "🎨"
    },
    {
      category: "Backend", 
      items: ["Node.js", "Python", "Java", "PostgreSQL", "MongoDB"],
      icon: "⚙️"
    },
    {
      category: "Cloud",
      items: ["AWS", "Azure", "Docker", "Kubernetes", "Serverless"],
      icon: "☁️"
    },
    {
      category: "Mobile",
      items: ["React Native", "Flutter", "iOS", "Android", "PWA"],
      icon: "📱"
    }
  ]

  return (
    <section className="py-20 px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/50 to-teal-50/50" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Experiencia Técnica
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Dominamos las tecnologías más avanzadas para crear soluciones robustas y escalables
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {technologies.map((tech, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white via-cyan-50/30 to-teal-50/30 ring-2 ring-gradient-to-r from-cyan-200 to-teal-200">
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {tech.icon}
                </div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent">
                  {tech.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tech.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center">
                      <span className="text-teal-600 mr-3 text-sm">▶</span>
                      <span className="text-slate-700 text-sm">{item}</span>
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