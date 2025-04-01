"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase } from "lucide-react"

export default function WorkExperience() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const experiences = [
    {
      id: 1,
      position: "Senior Web Developer",
      company: "Venturo Profesional Programmer",
      duration: "July 2023 - July 2025",
      location: "Malang, Indonesia",
      description: [
        "Led the development of a high-performance distributed system that improved data processing speed by 40%",
        "Architected and implemented microservices using C++ and gRPC, handling over 10,000 requests per second",
        "Mentored junior developers and conducted code reviews to ensure code quality and best practices",
        "Collaborated with product managers to define technical requirements and roadmaps for new features",
      ],
    },
    {
      id: 2,
      position: "Internship Web Developer",
      company: "Madani Jayantara",
      duration: "April 2023 - July 2023",
      location: "Malang, Indonesia",
      description: [
        "Developed and maintained backend services for a financial technology platform using Java and Spring Boot",
        "Implemented RESTful APIs that processed over £1 million in daily transactions",
        "Optimized database queries resulting in a 30% reduction in response time",
        "Participated in agile development processes, including daily stand-ups and sprint planning",
      ],
    },
    {
      id: 3,
      position: "Freelance Web Developer",
      company: "Freelance",
      duration: "January 2023 - March 2023",
      location: "Malang, Indonesia",
      description: [
        "Built responsive web applications using React and Node.js for various clients",
        "Implemented user authentication and authorization systems using JWT and OAuth",
        "Collaborated with designers to translate UI/UX wireframes into functional components",
        "Participated in code reviews and contributed to the company's internal component library",
      ],
    },
  ]

  return (
    <section id="work-experience" className="py-20">
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
            Experience
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Work Experience</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </motion.div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted-foreground/20 before:to-transparent">
          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              variants={fadeIn}
              className="relative flex items-start md:justify-center"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary shrink-0 md:order-1 md:ml-4">
                <Briefcase className="w-5 h-5" />
              </div>

              <Card className="w-full md:w-[calc(50%-2rem)] md:order-0 md:mr-4">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">{experience.position}</h3>
                    <Badge variant="outline" className="mt-2 md:mt-0 w-fit">
                      {experience.duration}
                    </Badge>
                  </div>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <span className="font-medium">{experience.company}</span>
                    <span className="mx-2">•</span>
                    <span>{experience.location}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {experience.description.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

