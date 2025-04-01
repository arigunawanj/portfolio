"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Lightbulb, Rocket } from "lucide-react";

export default function About() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="about" className="py-20 bg-muted/30">
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
            About Me
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Who I Am</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            variants={fadeIn}
          >
            <h3 className="text-2xl font-bold mb-4">A Passionate Developer</h3>
            <p className="text-md">
              I hold a{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                Master’s degree in Educational Technology{" "}
              </span>
              from Universitas Negeri Malang. Driven by my passion for
              technology and problem-solving, I made a bold career shift into{" "}
              <span className="font-semibold text-green-600 dark:text-green-400">
                web development{" "}
              </span>
              by joining an intensive bootcamp at Karisma Academy Malang.
            </p>
            <br />
            <p className="text-md">
              To solidify my skills, I completed a{" "}
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                3-month internship{" "}
              </span>
              as a Web Developer at Madani Jayantara, where I gained hands-on
              experience in building{" "}
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                scalable and efficient web solutions
              </span>
              .
            </p>
            <br />
            <p className="text-md">
              Additionally, I also joined a{" "}
              <span className="font-semibold text-red-500 dark:text-red-400">
                DevOps bootcamp{" "}
              </span>
              to enhance my skills and strengthen my career as a Web Developer.
              This experience allowed me to gain insights into{" "}
              <strong>
                CI/CD pipelines, cloud infrastructure, and deployment automation
              </strong>
              .
            </p>
            <br />
            <p className="text-md">
              Currently, I am a{" "}
              <span className="font-bold text-green-500 dark:text-green-400">
                Senior Web Developer at Venturo Malang
              </span>
              , crafting{" "}
              <span className="font-semibold text-blue-500 dark:text-blue-300">
                high-performance web applications{" "}
              </span>
              and optimizing user experiences.
            </p>
            <br />
            <p className="text-md">
              I have also worked on several web projects, including{" "}
              <strong>Space</strong>, a project management tool for Agile{" "}
              development; <strong>Timebox</strong>, a to-do list app; and{" "}
              <strong>Sislatkernas</strong>, a web platform for managing books
              and materials from KOMINFO. These projects have strengthened my
              skills in full-stack development and project management.
            </p>
            <br />
            <p className="text-md">
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
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              variants={fadeIn}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Code className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Clean Code</h4>
                      <p className="text-muted-foreground">
                        I write maintainable, scalable, and efficient code
                        following best practices and industry standards.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              variants={fadeIn}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">
                        Problem Solver
                      </h4>
                      <p className="text-muted-foreground">
                        I enjoy tackling complex challenges and finding elegant
                        solutions through creative thinking.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              variants={fadeIn}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Rocket className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">
                        Fast Learner
                      </h4>
                      <p className="text-muted-foreground">
                        I quickly adapt to new technologies and environments,
                        constantly expanding my skill set.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
