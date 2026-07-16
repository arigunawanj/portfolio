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
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Zap,
  Layout,
  Layers,
  Code
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { getIconByName } from "@/helpers/icon-mapping";
import { projectIconMap } from "@/helpers/icon-mapping";
import { cn } from "@/lib/utils";

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

export default function Projects({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.1 });
  const isMobile = useMediaQuery("(max-width: 768px)");

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
        (prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length
      );
    }
  };

  return (
    <section
      id="projects"
      className="py-24 bg-background relative overflow-hidden"
      ref={containerRef}
    >
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 bg-primary/5 text-primary">
            Selected Works
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Case <span className="text-gradient">Studies</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-purple-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card 
                className="group overflow-hidden border-border/40 glass-card transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer"
                onClick={() => {
                  setSelectedProject(project);
                  setActiveImageIndex(0);
                }}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={project.images[0] || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                    
                    {/* Floating Info Overlay */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tags.slice(0, 3).map((tag, i) => (
                          <Badge key={i} className="bg-white/10 backdrop-blur-md text-white border-white/20">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-black group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <div className="p-2 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-lg leading-relaxed mb-6">
                      {project.shortDescription}
                    </p>
                    
                    <div className="flex items-center gap-6 pt-6 border-t border-border/30">
                      <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                        <Layout className="h-4 w-4" />
                        UI/UX
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                        <Code className="h-4 w-4" />
                        Full Stack
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <Dialog
            open={!!selectedProject}
            onOpenChange={() => setSelectedProject(null)}
          >
            <DialogContent className="max-w-5xl p-0 overflow-hidden glass border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.2)]">
              <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[90vh]">
                {/* Visual Side */}
                <div className="lg:col-span-7 bg-muted relative overflow-hidden flex items-center justify-center">
                  <motion.img
                    key={activeImageIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={selectedProject.images[activeImageIndex] || "/placeholder.svg"}
                    className="w-full h-full object-cover"
                  />
                  
                  {selectedProject.images.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                      {selectedProject.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={cn(
                            "w-12 h-1.5 rounded-full transition-all duration-300",
                            idx === activeImageIndex ? "bg-primary w-16" : "bg-white/40 hover:bg-white/60"
                          )}
                        />
                      ))}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
                </div>

                {/* Content Side */}
                <div className="lg:col-span-5 p-8 md:p-12 overflow-y-auto">
                  <DialogTitle className="text-3xl font-black mb-4">
                    {selectedProject.title}
                  </DialogTitle>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedProject.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Tabs defaultValue="about" className="w-full">
                    <TabsList className="w-full grid grid-cols-2 bg-muted/50 rounded-2xl p-1 mb-8">
                      <TabsTrigger value="about" className="rounded-xl font-bold">About</TabsTrigger>
                      <TabsTrigger value="stack" className="rounded-xl font-bold">Features</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="about" className="space-y-6">
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        {selectedProject.fullDescription}
                      </p>
                      <div className="flex flex-wrap gap-4 pt-6">
                        <Button className="flex-1 h-14 rounded-2xl gap-2 font-bold shadow-xl shadow-primary/20" asChild>
                          <a href={selectedProject.demoLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-5 w-5" />
                            Live Demo
                          </a>
                        </Button>
                        <Button variant="outline" className="flex-1 h-14 rounded-2xl gap-2 font-bold border-2" asChild>
                          <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer">
                            <Github className="h-5 w-5" />
                            Source Code
                          </a>
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="stack" className="space-y-4">
                      {selectedProject.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Zap className="h-4 w-4" />
                          </div>
                          <span className="font-medium text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </section>
  );
}
