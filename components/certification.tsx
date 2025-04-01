"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, ExternalLink } from "lucide-react"

export default function Certification() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const certifications = [
    {
      id: 1,
      name: "Bootcamp Full Stack Web Developer",
      issuer: "Karisma Academy",
      date: "August 2022 - December 2022",
      description:
        "Advanced certification validating expertise in designing distributed systems on AWS, including high availability, cost optimization, and security best practices.",
      credentialId: "AWS-PSA-123456",
      credentialUrl: "#",
    },
    {
      id: 2,
      name: "EF Efekta",
      issuer: "English First",
      date: "February 2025 - September 2026",
      description:
        "Certification demonstrating ability to design, develop, and manage robust, secure, scalable, highly available, and dynamic solutions using Google Cloud technologies.",
      credentialId: "GCP-PCA-789012",
      credentialUrl: "#",
    },
    {
      id: 3,
      name: "Bootcamp Dev Ops",
      issuer: "Digital Skola",
      date: "April 2025 - July 2025",
      description:
        "Expert-level certification for designing cloud and hybrid solutions running on Microsoft Azure, including compute, network, storage, and security.",
      credentialId: "MS-ASA-345678",
      credentialUrl: "#",
    },
  ]

  return (
    <section id="certification" className="py-20">
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
            Certifications
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Certifications</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
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
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">{cert.name}</h3>
                      <div className="text-muted-foreground mb-3">
                        <span className="font-medium">{cert.issuer}</span>
                        <span className="mx-2">•</span>
                        <span>{cert.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{cert.description}</p>
                      <div className="text-sm text-muted-foreground mb-4">
                        <span className="font-medium">Credential ID:</span> {cert.credentialId}
                      </div>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Verify Credential
                        </a>
                      </Button>
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

