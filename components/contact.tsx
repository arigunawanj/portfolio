"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Phone, Github, Linkedin, Twitter, Gitlab, Instagram } from "lucide-react"

export default function Contact() {
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
    },
    {
      icon: <Gitlab className="h-5 w-5" />,
      name: "Gitlab",
      url: "https://gitlab.com/arigunawanj",
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/arigunawanj/",
    },
    {
      icon: <Instagram className="h-5 w-5" />,
      name: "Instagram",
      url: "http://instagram.com/awrigun/",
    },
    // {
    //   icon: <Twitter className="h-5 w-5" />,
    //   name: "Twitter",
    //   url: "https://twitter.com",
    // },
  ]

  return (
    <section id="contact" className="py-20 bg-muted/30">
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
            Contact
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            variants={fadeIn}
          >
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex flex-col items-center text-center p-4">
                      <div className="bg-primary/10 p-4 rounded-full mb-4">{info.icon}</div>
                      <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                      {info.link ? (
                        <a href={info.link} className="text-muted-foreground hover:text-primary transition-colors">
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{info.value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            variants={fadeIn}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6 text-center">Connect With Me</h3>
                <div className="flex justify-center gap-6">
                  {socialLinks.map((social, index) => (
                    <Button key={index} variant="outline" size="lg" className="flex items-center gap-2 px-6" asChild>
                      <a href={social.url} target="_blank" rel="noopener noreferrer">
                        {social.icon}
                        <span>{social.name}</span>
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

