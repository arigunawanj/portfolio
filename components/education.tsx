"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap } from "lucide-react"

export default function Education() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const education = [
    {
      id: 1,
      degree: "Bachelor's Degree of Educational Technology",
      institution: "Malang State of University",
      duration: "2015 - 2019",
      location: "Malang, East Java, Indonesia",
      description:
        "Specialized in Distributed Systems and High-Performance Computing. Thesis on 'Optimizing Distributed Database Systems for High-Throughput Applications' received distinction.",
      achievements: [
        "Graduated with Distinction (GPA: 3.51/4.0)",
      ],
    },
    {
      id: 2,
      degree: "Master's Degree of Educational Technology",
      institution: "Malang State of University",
      duration: "2020 - 2022",
      location: "Malang, East Java, Indonesia",
      description:
        "Comprehensive program covering both hardware and software aspects of computing systems. Final year project on 'Real-time Operating Systems for Embedded Devices'.",
      achievements: [
        "Graduated with Distinction (GPA: 3.91/4.0)",
      ],
    },
  ]

  return (
    <section id="education" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            Education
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Academic Background</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {education.map((item, index) => (
            <motion.div
              key={item.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              variants={fadeIn}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <h3 className="text-xl font-bold">{item.degree}</h3>
                        <Badge variant="outline" className="mt-2 md:mt-0 w-fit">
                          {item.duration}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground mb-4">
                        <span className="font-medium">{item.institution}</span>
                        <span className="mx-2">•</span>
                        <span>{item.location}</span>
                      </div>
                      <p className="text-muted-foreground mb-4">{item.description}</p>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Achievements:</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {item.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

