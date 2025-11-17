"use client";

import { useState, useRef, MouseEvent } from "react";
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
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Zap
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { projects } from "@/data/projects";
import { getIconByName } from "@/helpers/icon-mapping";
import { projectIconMap } from "@/helpers/icon-mapping";

// Define the Project type
type Project = {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  images: string[];
  tags: string[];
  features: string[];
  demoLink: string;
  githubLink: string;
  fullDescription: string;
  color: string;
};

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.1 });
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleNextImage = (e: MouseEvent) => {
    e.stopPropagation();
    if (selectedProject) {
      setActiveImageIndex((prev) => (prev + 1) % selectedProject.images.length);
    }
  };

  const handlePrevImage = (e: MouseEvent) => {
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
                            {getIconByName(projectIconMap[tag], "h-3 w-3 md:h-4 md:w-4")}
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
                      {getIconByName(projectIconMap[tag], "h-3 w-3 md:h-4 md:w-4")}
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
