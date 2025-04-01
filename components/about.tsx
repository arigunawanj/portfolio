"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Code,
  Lightbulb,
  Rocket,
  Coffee,
  Sparkles,
  Zap,
  Heart,
  Music,
  Gamepad2,
  BookOpen,
  Cpu,
  Globe,
} from "lucide-react";

export default function About() {
  const [activeTab, setActiveTab] = useState("professional");
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const tabs = [
    { id: "professional", label: "Professional" },
    { id: "personal", label: "Personal" },
    { id: "fun-facts", label: "Fun Facts" },
  ];

  const professionalSkills = [
    {
      icon: <Code className="h-6 w-6 text-primary" />,
      title: "Clean Code",
      description:
        "I write maintainable, scalable, and efficient code following best practices and industry standards.",
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-primary" />,
      title: "Problem Solver",
      description:
        "I enjoy tackling complex challenges and finding elegant solutions through creative thinking.",
    },
    {
      icon: <Rocket className="h-6 w-6 text-primary" />,
      title: "Fast Learner",
      description:
        "I quickly adapt to new technologies and environments, constantly expanding my skill set.",
    },
    {
      icon: <Cpu className="h-6 w-6 text-primary" />,
      title: "System Design",
      description:
        "I architect robust, scalable systems that can handle complex requirements and high loads.",
    },
    {
      icon: <Globe className="h-6 w-6 text-primary" />,
      title: "Global Perspective",
      description:
        "I've worked with international teams and understand the nuances of global software development.",
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Performance Optimizer",
      description:
        "I'm passionate about making software run faster and more efficiently.",
    },
  ];

  const personalTraits = [
    {
      icon: <Coffee className="h-6 w-6 text-primary" />,
      title: "Coffee Enthusiast",
      description:
        "I believe the best code is written with a perfect cup of coffee by your side.",
    },
    {
      icon: <Music className="h-6 w-6 text-primary" />,
      title: "Music Lover",
      description:
        "I enjoy listening to electronic and ambient music while coding to stay in the flow state.",
    },
    {
      icon: <Gamepad2 className="h-6 w-6 text-primary" />,
      title: "Casual Gamer",
      description:
        "I unwind by playing strategy and simulation games that challenge my problem-solving skills.",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      title: "Avid Reader",
      description:
        "I love reading technical books and science fiction to expand my imagination and knowledge.",
    },
    {
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: "Open Source Contributor",
      description:
        "I'm passionate about giving back to the community through open source contributions.",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: "Minimalist",
      description:
        "I appreciate clean, minimal design in both code and life - less is often more.",
    },
  ];

  const funFacts = [
    "I once debugged a production issue while hiking in the mountains",
    "My first computer was a Commodore 64 that I still keep as a memento",
    "I can type at 120 words per minute when I'm in the zone",
    "I've written over 1 million lines of code (and deleted probably twice as many)",
    "I maintain a collection of vintage programming books from the 80s and 90s",
    "I once stayed awake for 36 hours straight to finish a project (don't try this at home!)",
    "My rubber duck debugger has a name - it's Professor Quackers",
    "I can recite the first 100 digits of Pi (a useless but fun party trick)",
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "professional":
        return (
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {professionalSkills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          {skill.icon}
                        </motion.div>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold mb-2">
                          {skill.title}
                        </h4>
                        <p className="text-muted-foreground">
                          {skill.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        );
      case "personal":
        return (
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {personalTraits.map((trait, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          transition={{ duration: 0.3 }}
                        >
                          {trait.icon}
                        </motion.div>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold mb-2">
                          {trait.title}
                        </h4>
                        <p className="text-muted-foreground">
                          {trait.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        );
      case "fun-facts":
        return (
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  {funFacts.map((fact, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={
                        isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                      }
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : { scale: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          delay: 0.3 + index * 0.1,
                        }}
                        className="mt-1 min-w-[24px]"
                      >
                        <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary font-medium">
                          {index + 1}
                        </div>
                      </motion.div>
                      <motion.p
                        className="text-muted-foreground"
                        whileHover={{ x: 5 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        {fact}
                      </motion.p>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        );
      default:
        return null;
    }
  };

  // Animated code elements for the background
  const codeElements = [
    { id: 1, content: "<div>", x: "10%", y: "15%", delay: 0, duration: 15 },
    {
      id: 2,
      content: "function()",
      x: "85%",
      y: "25%",
      delay: 2,
      duration: 20,
    },
    { id: 3, content: "{}", x: "20%", y: "80%", delay: 1, duration: 18 },
    { id: 4, content: "</>", x: "75%", y: "70%", delay: 3, duration: 25 },
    { id: 5, content: "return()", x: "5%", y: "40%", delay: 2.5, duration: 22 },
    {
      id: 6,
      content: "const x = []",
      x: "90%",
      y: "50%",
      delay: 1.5,
      duration: 17,
    },
  ];

  return (
    <section
      id="about"
      className="py-20 bg-muted/30 relative overflow-hidden"
      ref={containerRef}
    >
      {/* Animated code elements in background */}
      {codeElements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute text-primary/5 font-mono text-4xl md:text-6xl font-bold pointer-events-none select-none"
          style={{ left: el.x, top: el.y }}
          initial={{ opacity: 0 }}
          animate={
            isInView
              ? {
                  opacity: [0.2, 0.5, 0.2],
                  y: [0, -20, 0],
                  transition: {
                    repeat: Number.POSITIVE_INFINITY,
                    duration: el.duration,
                    delay: el.delay,
                  },
                }
              : { opacity: 0 }
          }
        >
          {el.content}
        </motion.div>
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">
            About Me
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Who I Am</h2>
          <motion.div
            className="w-20 h-1 bg-primary mx-auto"
            initial={{ width: 0 }}
            animate={isInView ? { width: 80 } : { width: 0 }}
            transition={{ duration: 0.8 }}
          ></motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2"
          >
            <div className="relative">
              <motion.div
                initial={{ height: 0 }}
                animate={isInView ? { height: "100%" } : { height: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute left-0 top-0 w-1 bg-primary/30 rounded-full"
              ></motion.div>

              <div className="pl-6">
                <motion.h3
                  className="text-2xl font-bold mb-4 text-primary"
                  initial={{ x: -20, opacity: 0 }}
                  animate={
                    isInView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }
                  }
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  A Passionate Developer
                </motion.h3>

                <motion.p
                  className="text-muted-foreground mb-4"
                  initial={{ x: -20, opacity: 0 }}
                  animate={
                    isInView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }
                  }
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  I hold a{" "}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    Master’s degree in Educational Technology{" "}
                  </span>
                  from Universitas Negeri Malang. Driven by my passion for
                  technology and problem-solving, I made a bold career shift
                  into{" "}
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    web development{" "}
                  </span>
                  by joining an intensive bootcamp at Karisma Academy Malang.
                </motion.p>

                <motion.p
                  className="text-muted-foreground mb-4"
                  initial={{ x: -20, opacity: 0 }}
                  animate={
                    isInView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }
                  }
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  To solidify my skills, I completed a{" "}
                  <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                    3-month internship{" "}
                  </span>
                  as a Web Developer at Madani Jayantara, where I gained
                  hands-on experience in building{" "}
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    scalable and efficient web solutions
                  </span>
                  .
                </motion.p>

                <motion.p
                  className="text-muted-foreground mb-4"
                  initial={{ x: -20, opacity: 0 }}
                  animate={
                    isInView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }
                  }
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Additionally, I also joined a{" "}
                  <span className="font-semibold text-red-500 dark:text-red-400">
                    DevOps bootcamp{" "}
                  </span>
                  to enhance my skills and strengthen my career as a Web
                  Developer. This experience allowed me to gain insights into{" "}
                  <strong>
                    CI/CD pipelines, cloud infrastructure, and deployment
                    automation
                  </strong>
                  .
                </motion.p>

                <motion.p
                  className="text-muted-foreground mb-4"
                  initial={{ x: -20, opacity: 0 }}
                  animate={
                    isInView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }
                  }
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Currently, I am a{" "}
                  <span className="font-bold text-green-500 dark:text-green-400">
                    Senior Web Developer at Venturo Malang
                  </span>
                  , crafting{" "}
                  <span className="font-semibold text-blue-500 dark:text-blue-300">
                    high-performance web applications{" "}
                  </span>
                  and optimizing user experiences.
                </motion.p>

                <motion.p
                  className="text-muted-foreground mb-4"
                  initial={{ x: -20, opacity: 0 }}
                  animate={
                    isInView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }
                  }
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  I have also worked on several web projects, including{" "}
                  <strong>Space</strong>, a project management tool for Agile{" "}
                  development; <strong>Timebox</strong>, a to-do list app; and{" "}
                  <strong>Sislatkernas</strong>, a web platform for managing
                  books and materials from KOMINFO. These projects have
                  strengthened my skills in full-stack development and project
                  management.
                </motion.p>

                <motion.p
                  className="text-muted-foreground mb-4"
                  initial={{ x: -20, opacity: 0 }}
                  animate={
                    isInView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }
                  }
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Apart from my professional work, I am also an{" "}
                  <span className="font-semibold text-indigo-500 dark:text-indigo-400">
                    educational YouTuber{" "}
                  </span>
                  creating tutorial content on the latest web development
                  frameworks. You can check out my videos here:{" "}
                  <a
                    href="https://www.youtube.com/@arigunawanj"
                    className="font-semibold text-red-500 dark:text-red-400 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @arigunawanj
                  </a>
                  .
                </motion.p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-xs">
              {/* Decorative elements */}
              <motion.div
                className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full"
                animate={
                  isInView
                    ? {
                        scale: [1, 1.1, 1],
                        transition: {
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 3,
                        },
                      }
                    : {}
                }
              ></motion.div>

              <motion.div
                className="absolute -bottom-4 -right-4 w-32 h-32 bg-destructive/10 rounded-full"
                animate={
                  isInView
                    ? {
                        scale: [1, 1.15, 1],
                        transition: {
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 4,
                          delay: 1,
                        },
                      }
                    : {}
                }
              ></motion.div>

              {/* Profile image */}
              <motion.div
                className="relative z-10 bg-muted rounded-lg overflow-hidden shadow-xl"
                initial={{ y: 50, opacity: 0 }}
                animate={
                  isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }
                }
                transition={{ duration: 0.7, delay: 0.4 }}
                whileHover={{ y: -5 }}
              >
                <img
                  src="/material/ari.jpg"
                  alt="Ari Gunawan Jatmiko"
                  className="w-full h-auto"
                />

                {/* Floating badges */}
                <motion.div
                  className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={
                    isInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0 }
                  }
                  transition={{ delay: 0.8 }}
                >
                  <span className="flex items-center gap-1">
                    <Coffee className="h-3 w-3" />
                    Coffee Powered
                  </span>
                </motion.div>

                <motion.div
                  className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={
                    isInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0 }
                  }
                  transition={{ delay: 1 }}
                >
                  <span className="flex items-center gap-1">
                    <Code className="h-3 w-3" />
                    Code Artisan
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Tabs for different content sections */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-muted/50 rounded-full p-1 flex">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={`rounded-full ${
                  activeTab === tab.id ? "" : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Tab content */}
        {renderTabContent()}
      </div>
    </section>
  );
}
