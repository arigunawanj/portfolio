"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView, useMotionValue, useTransform, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin,
  Twitter,
  Copy,
  Check,
  ExternalLink,
  MousePointerClick,
  Instagram,
  Gitlab
} from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function Contact() {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.2 })
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Mouse position for card tilt effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // For the floating elements animation
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState("default")

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const contactInfo = [
     {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "Email",
      value: "arigunawanjatmiko@gmail.com",
      link: "mailto:arigunawanjatmiko@gmail.com",
    },
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: "Phone",
      value: "+62 81 588 28 916",
      link: "tel:+628158828916",
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Location",
      value: "Malang, East Java, Indonesia",
      link: null,
    },
  ]

  const socialLinks = [
    {
      icon: <Github className="h-5 w-5" />,
      name: "GitHub",
      url: "https://github.com/arigunawanj",
      color: "from-gray-700 to-gray-900",
      hoverColor: "group-hover:text-gray-100",
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/arigunawanj/",
      color: "from-blue-600 to-blue-800",
      hoverColor: "group-hover:text-blue-100",
    },
    // {
    //   icon: <Twitter className="h-5 w-5" />,
    //   name: "Twitter",
    //   url: "https://twitter.com",
    //   color: "from-sky-400 to-sky-600",
    //   hoverColor: "group-hover:text-sky-100",
    // },
     {
      icon: <Instagram className="h-5 w-5" />,
      name: "Instagram",
      url: "http://instagram.com/awrigun/",
      color: "from-pink-500 to-purple-600",
      hoverColor: "group-hover:text-pink-100",
    },
     {
      icon: <Gitlab className="h-5 w-5" />,
      name: "Gitlab",
      url: "https://gitlab.com/arigunawanj",
      color: "from-orange-500 to-red-600",
      hoverColor: "group-hover:text-orange-100",
    },
  ]

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const posX = e.clientX - centerX
    const posY = e.clientY - centerY
    mouseX.set(posX)
    mouseY.set(posY)
  }

  const handleCardMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  // Transform mouse position for card rotation
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10])
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10])

  // Cursor variants for interactive elements
  const cursorVariants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      opacity: 0,
    },
    hover: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
      opacity: 1,
      mixBlendMode: "difference",
    },
  }

  return (
    <section id="contact" className="py-16 md:py-24 bg-muted/30 relative overflow-hidden" ref={containerRef}>
      {/* Custom cursor for desktop */}
      {!isMobile && (
        <motion.div
          className="fixed top-0 left-0 w-8 h-8 bg-primary rounded-full pointer-events-none z-50 hidden md:flex items-center justify-center"
          variants={cursorVariants}
          animate={cursorVariant}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <MousePointerClick className="h-4 w-4 text-white" />
        </motion.div>
      )}

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        ></motion.div>
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        ></motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <Badge variant="outline" className="mb-3 md:mb-4">
            Contact
          </Badge>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">Get In Touch</h2>
          <motion.div
            className="w-16 md:w-20 h-1 bg-primary mx-auto"
            initial={{ width: 0 }}
            animate={isInView ? { width: isMobile ? 64 : 80 } : { width: 0 }}
            transition={{ duration: 0.8 }}
          ></motion.div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <motion.div
              style={{
                rotateX: !isMobile ? rotateX : 0,
                rotateY: !isMobile ? rotateY : 0,
                transformStyle: "preserve-3d",
              }}
              // onMouseMove={!isMobile ? handleCardMouseMove : undefined}
              // onMouseLeave={!isMobile ? handleCardMouseLeave : undefined}
              className="perspective-1000"
            >
              <Card className="bg-gradient-to-br from-background/80 to-muted/50 backdrop-blur-sm border border-muted/50 overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-muted/20">
                    {contactInfo.map((info, index) => (
                      <motion.div
                        key={index}
                        className="flex flex-col items-center text-center p-6 md:p-8 relative group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        // onMouseEnter={() => !isMobile && setCursorVariant("hover")}
                        // onMouseLeave={() => !isMobile && setCursorVariant("default")}
                      >
                        <motion.div
                          className="bg-primary/10 p-4 rounded-full mb-4 relative"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <motion.div
                            animate={{
                              rotate: [0, 10, 0, -10, 0],
                            }}
                            transition={{
                              duration: 5,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "loop",
                              ease: "easeInOut",
                              times: [0, 0.2, 0.5, 0.8, 1],
                            }}
                          >
                            {info.icon}
                          </motion.div>

                          {/* Decorative rings */}
                          <motion.div
                            className="absolute -inset-1 rounded-full border border-primary/30 opacity-0 group-hover:opacity-100"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "loop",
                            }}
                          ></motion.div>
                          <motion.div
                            className="absolute -inset-2 rounded-full border border-primary/20 opacity-0 group-hover:opacity-100"
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{
                              duration: 2.5,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "loop",
                              delay: 0.2,
                            }}
                          ></motion.div>
                        </motion.div>

                        <h3 className="text-lg font-semibold mb-2">{info.title}</h3>

                        <div className="relative">
                          {info.link ? (
                            <a
                              href={info.link}
                              className="text-muted-foreground hover:text-primary transition-colors group-hover:underline"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="text-muted-foreground">{info.value}</p>
                          )}

                          {info.link && (
                            <motion.button
                              className="absolute -right-6 top-1/4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleCopy(info.value, info.title)}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <AnimatePresence mode="wait">
                                {copiedField === info.title ? (
                                  <motion.div
                                    key="check"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <Check className="h-4 w-4 text-green-500" />
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="copy"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <Copy className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl md:text-2xl font-semibold mb-6 text-center">Connect With Me</h3>

            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6">
              {socialLinks.map((social, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{
                    y: -5,
                    transition: { type: "spring", stiffness: 400, damping: 10 },
                  }}
                  // onMouseEnter={() => !isMobile && setCursorVariant("hover")}
                  // onMouseLeave={() => !isMobile && setCursorVariant("default")}
                >
                  <a href={social.url} target="_blank" rel="noopener noreferrer" className="block w-full">
                    <Card
                      className={`group overflow-hidden bg-gradient-to-br ${social.color} hover:shadow-lg transition-all duration-300 border-0`}
                    >
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          {/* Background pattern */}
                          <div className="absolute inset-0 opacity-10">
                            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                              <defs>
                                <pattern id={`grid-${index}`} width="10" height="10" patternUnits="userSpaceOnUse">
                                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                                </pattern>
                              </defs>
                              <rect width="100" height="100" fill={`url(#grid-${index})`} />
                            </svg>
                          </div>

                          <div className="p-6 md:p-8 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3">
                              <div className="bg-white/10 p-3 rounded-full">
                                <motion.div
                                  whileHover={{ rotate: 360 }}
                                  transition={{ duration: 0.5 }}
                                  className={`text-white ${social.hoverColor}`}
                                >
                                  {social.icon}
                                </motion.div>
                              </div>
                              <span className="text-white font-medium">{social.name}</span>
                            </div>
                            <ExternalLink className="ms-3 h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
                          </div>

                          {/* Animated gradient overlay */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100"
                            animate={{
                              x: ["-100%", "100%"],
                            }}
                            transition={{
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "loop",
                              duration: 1.5,
                              ease: "linear",
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

