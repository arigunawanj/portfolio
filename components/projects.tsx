"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ExternalLink,
  Github,
  ChevronDown,
  Code,
  Database,
  Server,
  Cpu,
  Globe,
  Layers,
  Zap,
  Monitor,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Palette,
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.1 });
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Technology stack icons mapping
  const techIcons = {
    PHP: <Cpu className="h-3 w-3 md:h-4 md:w-4" />,
    Laravel: <Code className="h-3 w-3 md:h-4 md:w-4" />,
    MySQL: <Database className="h-3 w-3 md:h-4 md:w-4" />,
    Tailwind: <Palette className="h-3 w-3 md:h-4 md:w-4" />,
    Bootstrap: <Palette className="h-3 w-3 md:h-4 md:w-4" />,
    MongoDB: <Database className="h-3 w-3 md:h-4 md:w-4" />,
    Filament: <Code className="h-3 w-3 md:h-4 md:w-4" />,
    Livewire: <Monitor className="h-3 w-3 md:h-4 md:w-4" />,
    Inertia: <Monitor className="h-3 w-3 md:h-4 md:w-4" />,
    Angular: <Monitor className="h-3 w-3 md:h-4 md:w-4" />,
    "Angular 9": <Monitor className="h-3 w-3 md:h-4 md:w-4" />,
    "Angular 18": <Monitor className="h-3 w-3 md:h-4 md:w-4" />,
    React: <Monitor className="h-3 w-3 md:h-4 md:w-4" />,
    Vue: <Monitor className="h-3 w-3 md:h-4 md:w-4" />,
    Javascript: <Cpu className="h-3 w-3 md:h-4 md:w-4" />,
    Typescript: <Cpu className="h-3 w-3 md:h-4 md:w-4" />,
    Redis: <Database className="h-3 w-3 md:h-4 md:w-4" />,
    Linux: <Server className="h-3 w-3 md:h-4 md:w-4" />,
    "Next.js": <Monitor className="h-3 w-3 md:h-4 md:w-4" />,
  };

  const projects = [
    {
      id: 1,
      title: "Welantin",
      shortDescription:
        "A full-featured e-commerce platform with product management.",
      description:
        "An inventory management system for CV companies in freelance projects, simplifying stock management.",
      images: ["/portfolio/welantin/1.png"],
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
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      id: 2,
      title: "Iniitu",
      shortDescription:
        "An invoice creation application for UMKM(MSMEs) in freelance projects, enabling easier invoice recording and management.",
      description:
        "A collaborative task management application with real-time updates and team workspaces.",
      images: ["/portfolio/iniitu/1.png"],
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
      color: "from-green-500/20 to-emerald-500/20",
    },
    {
      id: 3,
      title: "SPACE - Venturo",
      shortDescription:
        "A project management system for Agile development that helps teams efficiently plan and track project progress.",
      description:
        "A comprehensive system monitoring tool with real-time analytics and performance tracking.",
      images: ["/portfolio/space/1.png"],
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
      color: "from-purple-500/20 to-indigo-500/20",
    },
    {
      id: 4,
      title: "Timebox - Venturo",
      shortDescription:
        "An application like a To-Do List designed to enhance productivity by allocating time for each task.",
      description:
        "A custom programming language compiler with advanced optimization features.",
      images: ["/portfolio/timebox/1.png"],
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
      color: "from-amber-500/20 to-yellow-500/20",
    },
    {
      id: 5,
      title: "Kelas - Venturo",
      shortDescription:
        "A training platform for new employees to understand the schemes and processes applicable at the office.",
      description:
        "A distributed database system with high availability and fault tolerance.",
      images: ["/portfolio/kelas/1.png"],
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
      color: "from-red-500/20 to-orange-500/20",
    },
    {
      id: 6,
      title: "Sislatkernas - KOMINFO",
      shortDescription:
        "A website used for processing books and materials from KOMINFO (Ministry of Communication and Information Technology), supporting more organized digital document management.",
      description:
        "A deep learning framework with CUDA acceleration and optimization features.",
      images: ["/portfolio/sislatkernas/1.png"],
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
      color: "from-teal-500/20 to-cyan-500/20",
    },
    {
      id: 7,
      title: "Masjid Dana",
      shortDescription:
        " A platform for splitting purchase costs when ordering food online, simplifying bill division.",
      description:
        "A deep learning framework with CUDA acceleration and optimization features.",
      images: [
        "/placeholder.svg?height=400&width=600&text=Neural+Network+Visualization",
        "/placeholder.svg?height=400&width=600&text=Training+Interface",
        "/placeholder.svg?height=400&width=600&text=Performance+Benchmarks",
      ],
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
      color: "from-purple-500/20 to-indigo-500/20",
    },
    {
      id: 8,
      title: "AGJKAS",
      shortDescription:
        " A financial recording application that includes installment, debt, and receivable management.",
      description:
        "A deep learning framework with CUDA acceleration and optimization features.",
      images: ["/portfolio/agjkas/1.png"],
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
      color: "from-green-500/20 to-emerald-500/20",
    },
    {
      id: 9,
      title: "AGJ Split Bill Food Order Online",
      shortDescription: "A platform for splitting food order costs online via apps like ShopeeFood, GoFood, or GrabFood.",
      description: "A web application that simplifies bill-splitting when ordering food online with friends or groups.",
      images: [
        "/portfolio/splitbill/1.png",
        "/portfolio/splitbill/2.png",
      ],
      tags: ["PHP", "Laravel", "Tailwind", "Next.js", "Livewire"],
      features: [
        "Split by number of people",
        "Split by items ordered",
        "Automatic calculation",
        "Payment integration",
        "Transaction history",
      ],
      demoLink: "https://splitbill.arigunawanj.com/",
      githubLink: "https://github.com/arigunawanj/split-bill-fe",
      fullDescription: "AGJ Split Bill is a web app that helps users fairly split food order costs from services like ShopeeFood, GoFood, and GrabFood. It supports splitting by person or item, with automatic calculations, payment integration, and transaction history.",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      id: 10,
      title: "AGJ Flixstore",
      shortDescription:
        " A platform for splitting purchase costs when ordering food online, simplifying bill division.",
      description:
        "A deep learning framework with CUDA acceleration and optimization features.",
      images: ["/portfolio/agjflixstore/1.png"],
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
      color: "from-sky-400/20 to-green-300/20",
    },
  ];

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (selectedProject) {
      setActiveImageIndex((prev) => (prev + 1) % selectedProject.images.length);
    }
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (selectedProject) {
      setActiveImageIndex(
        (prev) =>
          (prev - 1 + selectedProject.images.length) %
          selectedProject.images.length
      );
    }
  };

  return (
    <section
      id="projects"
      className="py-12 md:py-20 bg-muted/30 relative overflow-hidden"
      ref={containerRef}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-16"
        >
          <Badge variant="outline" className="mb-3 md:mb-4">
            Portfolio
          </Badge>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
            Featured Projects
          </h2>
          <motion.div
            className="w-16 md:w-20 h-1 bg-primary mx-auto"
            initial={{ width: 0 }}
            animate={isInView ? { width: isMobile ? 64 : 80 } : { width: 0 }}
            transition={{ duration: 0.8 }}
          ></motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: isMobile ? 0.1 : index * 0.1,
              }}
              variants={fadeIn}
            >
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <Card
                  className={`group h-full cursor-pointer transition-all duration-300 hover:shadow-lg overflow-hidden border-0 bg-gradient-to-br ${project.color}`}
                  onClick={() =>
                    setExpandedProject(
                      expandedProject === project.id ? null : project.id
                    )
                  }
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <motion.img
                        src={project.images[0] || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full aspect-video object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent p-4 md:p-6 flex flex-col justify-end">
                        <motion.h3
                          className="text-lg md:text-xl font-bold mb-1 md:mb-2"
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          {project.title}
                        </motion.h3>
                        <motion.p
                          className="text-xs md:text-sm text-muted-foreground"
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                          {project.shortDescription}
                        </motion.p>
                      </div>
                    </div>

                    <div className="p-4 md:p-6">
                      <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4">
                        {project.tags.map((tag, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs flex items-center gap-1 px-2 py-1 bg-background/50 backdrop-blur-sm"
                          >
                            {techIcons[tag] || null}
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <AnimatePresence>
                        {expandedProject === project.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-3 md:space-y-4 border-t pt-3"
                          >
                            <div className="space-y-1 md:space-y-2">
                              <h4 className="text-sm md:text-base font-semibold">
                                Key Features:
                              </h4>
                              <ul className="list-disc list-inside text-xs md:text-sm text-muted-foreground space-y-0.5 md:space-y-1">
                                {project.features
                                  .slice(0, 3)
                                  .map((feature, i) => (
                                    <li key={i}>{feature}</li>
                                  ))}
                                {project.features.length > 3 && (
                                  <li
                                    className="text-primary cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedProject(project);
                                    }}
                                  >
                                    +{project.features.length - 3} more
                                    features...
                                  </li>
                                )}
                              </ul>
                            </div>

                            <div className="flex flex-wrap gap-2 md:gap-4 pt-2">
                              <Button
                                size={isMobile ? "sm" : "default"}
                                variant="outline"
                                className="text-xs md:text-sm bg-background/50 backdrop-blur-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(project.githubLink, "_blank");
                                }}
                              >
                                <Github className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                                Code
                              </Button>
                              <Button
                                size={isMobile ? "sm" : "default"}
                                className="text-xs md:text-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(project.demoLink, "_blank");
                                }}
                              >
                                <ExternalLink className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                                Demo
                              </Button>
                              <Button
                                size={isMobile ? "sm" : "default"}
                                variant="outline"
                                className="text-xs md:text-sm bg-background/50 backdrop-blur-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveImageIndex(0);
                                  setSelectedProject(project);
                                }}
                              >
                                Details
                                <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-1 md:ml-2" />
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex justify-center mt-2">
                        <motion.div
                          whileHover={{ y: 3 }}
                          whileTap={{ y: 5 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          }}
                          className="bg-background/50 backdrop-blur-sm rounded-full p-1 w-8 h-8 flex items-center justify-center"
                        >
                          <ChevronDown
                            className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${
                              expandedProject === project.id ? "rotate-180" : ""
                            }`}
                          />
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedProject && (
        <Dialog
          open={!!selectedProject}
          onOpenChange={() => {
            setSelectedProject(null);
            setActiveImageIndex(0);
          }}
        >
          <DialogContent className="max-w-[90vw] md:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto p-0">
            <div className="relative">
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={
                    selectedProject.images[activeImageIndex] ||
                    "/placeholder.svg"
                  }
                  alt={`${selectedProject.title} screenshot ${
                    activeImageIndex + 1
                  }`}
                  className="w-full h-full object-cover"
                />

                {/* Image navigation controls */}
                {selectedProject.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/40 backdrop-blur-sm hover:bg-background/60 rounded-full"
                      onClick={handlePrevImage}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/40 backdrop-blur-sm hover:bg-background/60 rounded-full"
                      onClick={handleNextImage}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>

                    {/* Image indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {selectedProject.images.map((_, idx) => (
                        <button
                          key={idx}
                          className={`w-2 h-2 rounded-full ${
                            idx === activeImageIndex
                              ? "bg-primary"
                              : "bg-background/60"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex(idx);
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-background/80 to-transparent backdrop-blur-sm p-4">
                <DialogTitle className="text-xl md:text-2xl">
                  {selectedProject.title}
                </DialogTitle>
                <div className="flex flex-wrap gap-1.5 md:gap-2 mt-2">
                  {selectedProject.tags.map((tag, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="text-xs flex items-center gap-1 px-2 py-1 bg-background/50 backdrop-blur-sm"
                    >
                      {techIcons[tag] || null}
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4 space-y-4">
                  <p className="text-sm md:text-base text-muted-foreground">
                    {selectedProject.fullDescription}
                  </p>

                  <div className="flex flex-wrap justify-end gap-2 md:gap-4 mt-6">
                    <Button
                      variant="outline"
                      size={isMobile ? "sm" : "default"}
                      asChild
                    >
                      <a
                        href={selectedProject.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                        View Code
                      </a>
                    </Button>
                    <Button size={isMobile ? "sm" : "default"} asChild>
                      <a
                        href={selectedProject.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="features" className="mt-4">
                  <div className="space-y-2 md:space-y-4">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                      {selectedProject.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="mt-1 bg-primary/20 rounded-full p-1 flex-shrink-0">
                            <Zap className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                          </div>
                          <span className="text-sm md:text-base text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
