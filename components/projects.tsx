"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExternalLink, Github, ChevronDown } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [expandedProject, setExpandedProject] = useState(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const projects = [
    {
      id: 1,
      title: "Welantin",
      shortDescription:
        "An inventory management system for CV companies in freelance projects, simplifying stock management.",
      description: "Inventory management system for CV companies.",
      image: "/material/ari.jpg",
      tags: ["PHP", "Laravel", "MySQL", "Tailwind", "Livewire", "Filament"],
      features: [
        "Stock tracking",
        "Low stock notifications",
        "Inventory reports",
        "Supplier management",
        "Stock value calculation",
      ],
      demoLink: "https://welantin.com/",
      githubLink: "#",
      fullDescription:
        "This e-commerce platform provides businesses with a complete solution for selling products online. Built with C++ and Qt for high performance and cross-platform compatibility. Features include a responsive design, product catalog with filtering and search capabilities, shopping cart functionality, secure checkout integration, user authentication, and an admin dashboard for managing products, orders, and customers.",
    },
    {
      id: 2,
      title: "Iniitu",
      shortDescription:
        "An invoice creation application for UMKM(MSMEs) in freelance projects, enabling easier invoice recording and management.",
      description:
        "A collaborative task management application with real-time updates and team workspaces.",
      image: "/material/ari.jpg",
      tags: [
        "PHP",
        "Laravel",
        "MySQL",
        "Tailwind",
        "Livewire",
        "Inertia",
        "React",
        "Filament",
      ],
      features: ["Progress tracking", "Automatic Invoice"],
      demoLink: "https://iniitu.id/",
      githubLink: "#",
      fullDescription:
        "This task management system helps teams organize and track their work efficiently. Built with Java Spring Boot for the backend and React for the frontend, it provides robust task management capabilities. Features include task creation and assignment, due dates and reminders, progress tracking, file attachments, comments and discussions, team workspaces, and real-time updates.",
    },
    {
      id: 3,
      title: "SPACE - Venturo",
      shortDescription:
        "A project management system for Agile development that helps teams efficiently plan and track project progress.",
      description:
        "A comprehensive system monitoring tool with real-time analytics and performance tracking.",
      image: "/material/ari.jpg",
      tags: [
        "PHP",
        "Laravel",
        "MySQL",
        "MongoDB",
        "Tailwind",
        "Bootstrap",
        "Angular 9",
        "Angular 18",
      ],
      features: [
        "Sprint planning",
        "Task tracking",
        "Kanban boards",
        "Progress reports",
        "Team collaboration",
      ],
      demoLink: "https://space.venturo.id/",
      githubLink: "#",
      fullDescription:
        "This system resource monitor provides real-time insights into system performance. Built primarily in C++ with Python for data analysis, it offers comprehensive monitoring capabilities. The application tracks CPU usage, memory consumption, network traffic, and disk operations, providing detailed analytics and alerts for system administrators.",
    },
    {
      id: 4,
      title: "Timebox - Venturo",
      shortDescription:
        "An application like a To-Do List designed to enhance productivity by allocating time for each task.",
      description:
        "A custom programming language compiler with advanced optimization features.",
      image: "/material/ari.jpg",
      tags: ["Laravel", "MySQL", "MongoDB"],
      features: [
        "Timeboxing",
        "Reminders",
        "Time tracking",
        "Productivity analysis",
        "Task categories",
      ],
      demoLink: "https://timebox.venturo.id/",
      githubLink: "#",
      fullDescription:
        "This compiler project implements a custom programming language with modern features and optimizations. Built using C and LLVM, it includes comprehensive error handling and code optimization capabilities. The compiler performs lexical analysis, syntax parsing, semantic analysis, and generates optimized assembly code.",
    },
    {
      id: 5,
      title: "Kelas - Venturo",
      shortDescription:
        " A training platform for new employees to understand the schemes and processes applicable at the office.",
      description:
        "A distributed database system with high availability and fault tolerance.",
      image: "/material/ari.jpg",
      tags: ["PHP", "Laravel", "MySQL", "Bootstrap", "Angular 9"],
      features: [
        "Learning modules",
        "Quizzes",
        "Discussion forums",
        "Progress tracking",
        "Certificates",
      ],
      demoLink: "https://kelas.venturo.id/",
      githubLink: "#",
      fullDescription:
        "This distributed database system provides high availability and fault tolerance for large-scale applications. Built with C++ and Rust for performance, it implements advanced features such as data replication, sharding, and automatic failover. The system includes comprehensive monitoring and management tools.",
    },
    {
      id: 6,
      title: "Sislatkernas - KOMINFO",
      shortDescription:
        "A website used for processing books and materials from KOMINFO (Ministry of Communication and Information Technology), supporting more organized digital document management.",
      description:
        "A deep learning framework with CUDA acceleration and optimization features.",
      image: "/material/ari.jpg",
      tags: ["PHP", "Laravel", "MySQL", "Tailwind", "React"],
      features: [
        "Document storage",
        "Search",
        "Download",
        "Version management",
        "Collaboration",
      ],
      demoLink: "https://standar.sdmdigital.id/skkni",
      githubLink: "#",
      fullDescription:
        "This neural network framework provides high-performance deep learning capabilities. Built primarily in C++ with CUDA acceleration, it offers comprehensive tools for building and training neural networks. Features include automatic differentiation, model optimization, and detailed performance profiling.",
    },
    {
      id: 7,
      title: "Masjid Dana",
      shortDescription:
        " A platform for splitting purchase costs when ordering food online, simplifying bill division.",
      description:
        "A deep learning framework with CUDA acceleration and optimization features.",
      image: "/material/ari.jpg",
      tags: ["PHP", "Laravel", "MySQL", "Tailwind", "Vue"],
      features: [
        "CUDA acceleration",
        "Automatic differentiation",
        "Model optimization",
        "Training pipelines",
        "Performance profiling",
      ],
      demoLink: "#",
      githubLink: "#",
      fullDescription:
        "This neural network framework provides high-performance deep learning capabilities. Built primarily in C++ with CUDA acceleration, it offers comprehensive tools for building and training neural networks. Features include automatic differentiation, model optimization, and detailed performance profiling.",
    },
    {
      id: 8,
      title: "AGJKAS",
      shortDescription:
        " A financial recording application that includes installment, debt, and receivable management.",
      description:
        "A deep learning framework with CUDA acceleration and optimization features.",
      image: "/material/ari.jpg",
      tags: ["PHP", "Laravel", "Tailwind", "Filament"],
      features: [
        "Debt management",
        "Receivable management",
        "Installment management",
        "Financial reports",
        "Transaction recording",
      ],
      demoLink: "https://agjkas.com/",
      githubLink: "#",
      fullDescription:
        "This neural network framework provides high-performance deep learning capabilities. Built primarily in C++ with CUDA acceleration, it offers comprehensive tools for building and training neural networks. Features include automatic differentiation, model optimization, and detailed performance profiling.",
    },
    {
      id: 9,
      title: "AGJ Split Bill Food Order Online",
      shortDescription:
        " A platform for splitting purchase costs when ordering food online, simplifying bill division.",
      description:
        "A deep learning framework with CUDA acceleration and optimization features.",
      image: "/material/ari.jpg",
      tags: ["PHP", "Laravel", "Tailwind"],
      features: [
        "Split by number of people",
        "Split by items ordered",
        "Automatic calculation",
        "Payment integration",
        "Transaction history",
      ],
      demoLink: "#",
      githubLink: "#",
      fullDescription:
        "This neural network framework provides high-performance deep learning capabilities. Built primarily in C++ with CUDA acceleration, it offers comprehensive tools for building and training neural networks. Features include automatic differentiation, model optimization, and detailed performance profiling.",
    },
    {
      id: 10,
      title: "AGJ Flixstore",
      shortDescription:
        " A platform for splitting purchase costs when ordering food online, simplifying bill division.",
      description:
        "A deep learning framework with CUDA acceleration and optimization features.",
      image: "/material/ari.jpg",
      tags: [
        "PHP",
        "Laravel",
        "MySQL",
        "Tailwind",
        "Livewire",
        "Inertia",
        "React",
        "Filament",
      ],
      features: [
        "CUDA acceleration",
        "Automatic differentiation",
        "Model optimization",
        "Training pipelines",
        "Performance profiling",
      ],
      demoLink: "https://agjflixstore.com/",
      githubLink: "#",
      fullDescription:
        "This neural network framework provides high-performance deep learning capabilities. Built primarily in C++ with CUDA acceleration, it offers comprehensive tools for building and training neural networks. Features include automatic differentiation, model optimization, and detailed performance profiling.",
    },
  ];

  return (
    <section id="projects" className="py-12 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={fadeIn}
          className="text-center mb-8 md:mb-16"
        >
          <Badge variant="outline" className="mb-3 md:mb-4">
            Portfolio
          </Badge>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">Featured Projects</h2>
          <div className="w-16 md:w-20 h-1 bg-primary mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: isMobile ? 0.1 : index * 0.1 }}
              variants={fadeIn}
            >
              <Card
                className={`group h-full cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  expandedProject === project.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/20 p-4 md:p-6 flex flex-col justify-end">
                      <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">{project.title}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">{project.shortDescription}</p>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedProject === project.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 md:p-6 border-t"
                      >
                        <div className="space-y-3 md:space-y-4">
                          <div className="flex flex-wrap gap-1 md:gap-2">
                            {project.tags.map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="space-y-1 md:space-y-2">
                            <h4 className="text-sm md:text-base font-semibold">Key Features:</h4>
                            <ul className="list-disc list-inside text-xs md:text-sm text-muted-foreground space-y-0.5 md:space-y-1">
                              {project.features.map((feature, i) => (
                                <li key={i}>{feature}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex flex-wrap gap-2 md:gap-4 pt-2">
                            <Button
                              size={isMobile ? "sm" : "default"}
                              variant="outline"
                              className="text-xs md:text-sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(project.githubLink, "_blank")
                              }}
                            >
                              <Github className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                              Code
                            </Button>
                            <Button
                              size={isMobile ? "sm" : "default"}
                              className="text-xs md:text-sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(project.demoLink, "_blank")
                              }}
                            >
                              <ExternalLink className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                              Demo
                            </Button>
                            <Button
                              size={isMobile ? "sm" : "default"}
                              variant="outline"
                              className="text-xs md:text-sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedProject(project)
                              }}
                            >
                              Learn More
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="p-2 md:p-4 text-center">
                    <ChevronDown
                      className={`w-5 h-5 md:w-6 md:h-6 mx-auto transition-transform duration-300 ${
                        expandedProject === project.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-[90vw] md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl md:text-2xl">{selectedProject.title}</DialogTitle>
              <DialogDescription>
                <div className="flex flex-wrap gap-1 md:gap-2 mt-2 mb-3 md:mb-4">
                  {selectedProject.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 md:space-y-4 px-1">
              <img
                src={selectedProject.image || "/placeholder.svg"}
                alt={selectedProject.title}
                className="w-full rounded-md object-cover aspect-video"
              />
              <p className="text-sm md:text-base text-muted-foreground">{selectedProject.fullDescription}</p>
              <div className="space-y-2 md:space-y-4">
                <h4 className="text-sm md:text-base font-semibold">Key Features:</h4>
                <ul className="list-disc list-inside text-xs md:text-sm text-muted-foreground space-y-1 md:space-y-2">
                  {selectedProject.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap justify-end gap-2 md:gap-4 mt-4">
                <Button variant="outline" size={isMobile ? "sm" : "default"} asChild>
                  <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer">
                    <Github className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    View Code
                  </a>
                </Button>
                <Button size={isMobile ? "sm" : "default"} asChild>
                  <a href={selectedProject.demoLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    Live Demo
                  </a>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  )
}

