"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { tabs, professionalSkills, personalTraits, funFacts } from "@/data/about";
import { getIconByName } from "@/helpers/icon-mapping";
import { Code, Coffee, Sparkles, User, Target, Zap } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function About() {
  const [activeTab, setActiveTab] = useState("professional");
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.1 });
  const isMobile = useMediaQuery("(max-width: 768px)");

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const renderTabContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {activeTab === "professional" && professionalSkills.map((skill, index) => (
            <SkillCard key={index} skill={skill} index={index} isInView={isInView} />
          ))}
          {activeTab === "personal" && personalTraits.map((trait, index) => (
            <SkillCard key={index} skill={trait} index={index} isInView={isInView} />
          ))}
          {activeTab === "fun-facts" && (
            <div className="lg:col-span-3 max-w-4xl mx-auto w-full">
              <Card className="glass-card overflow-hidden">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {funFacts.map((fact, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-background/40 border border-border/50 hover:border-primary/30 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0 group-hover:scale-110 transition-transform">
                          {index + 1}
                        </div>
                        <p className="text-muted-foreground group-hover:text-foreground transition-colors">{fact}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <section
      id="about"
      className="py-24 bg-background relative overflow-hidden"
      ref={containerRef}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-purple-500/5 blur-[100px] rounded-full" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 bg-primary/5 text-primary">
            About Me
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            The Person Behind The <span className="text-gradient">Code</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-purple-500 mx-auto rounded-full shadow-lg shadow-primary/20"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="relative pl-8 border-l-4 border-primary/30 py-4 bg-gradient-to-r from-primary/5 to-transparent rounded-r-3xl">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground flex items-center gap-3">
                <Sparkles className="text-primary h-7 w-7" />
                Crafting Digital Excellence
              </h3>
              
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  I am a <span className="text-foreground font-bold">Senior Web Developer</span> with a unique background in 
                  <span className="text-primary font-semibold"> Educational Technology</span>. This blend allows me to approach development not just as a coder, but as an architect of knowledge and user experience.
                </p>
                <p>
                  Since transitioning into tech through an intensive bootcamp, I've spent my career mastering the art of 
                  <span className="text-foreground font-semibold"> high-performance full-stack development</span> and 
                  <span className="text-foreground font-semibold"> DevOps automation</span>.
                </p>
                <p>
                  Currently leading web projects at <span className="text-primary font-bold underline decoration-2 underline-offset-4">Venturo Malang</span>, 
                  I focus on creating scalable, efficient, and user-centric solutions that make a real impact.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl">
                  <User className="h-5 w-5 text-primary" />
                  <span className="font-bold">Lifelong Learner</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl">
                  <Target className="h-5 w-5 text-purple-500" />
                  <span className="font-bold">Problem Solver</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span className="font-bold">Tech Enthusiast</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
            animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative z-10 group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-purple-500/20 blur-2xl group-hover:blur-3xl transition-all opacity-0 group-hover:opacity-100" />
              <div className="relative glass p-3 rounded-[2.5rem] shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
                <img
                  src="/material/ari.jpg"
                  alt="Ari Gunawan Jatmiko"
                  className="rounded-[2rem] w-full h-auto object-cover"
                />
              </div>

              {/* Floating Stat Badges */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-6 -right-6 glass-card p-4 rounded-2xl shadow-xl z-20"
              >
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-primary">3+</span>
                  <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Years Exp</span>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                className="absolute -bottom-6 -left-6 glass-card p-4 rounded-2xl shadow-xl z-20"
              >
                <div className="flex flex-col items-center">
                  <Coffee className="h-6 w-6 text-orange-500 mb-1" />
                  <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Unlimited Code</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Content Tabs */}
        <div className="flex flex-col items-center space-y-12">
          <div className="p-1.5 glass rounded-[2rem] flex items-center shadow-inner">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-6 md:px-10 py-3 rounded-[1.5rem] text-sm md:text-base font-bold transition-all duration-300 relative",
                  activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="about-pill"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-[1.5rem]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="w-full">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillCard({ skill, index, isInView }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
    >
      <Card className="h-full glass-card group border-primary/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
        <CardContent className="p-8">
          <div className="flex flex-col items-start gap-5">
            <div className="p-4 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
              {getIconByName(skill.icon, "h-8 w-8")}
            </div>
            <div>
              <h4 className="text-xl font-black mb-3 group-hover:text-primary transition-colors">
                {skill.title}
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                {skill.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
