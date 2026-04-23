"use client";

import { useEffect, useState } from "react";
import { Github, Linkedin, Mail, MapPin, Phone, ExternalLink, Calendar, Award, Briefcase, GraduationCap, Code, Menu, X, ArrowRight, Star, Sun, Moon, Download, FileText, Twitter, Facebook, Instagram, Youtube, Globe, MessageCircle, Triangle, Square, Circle, Hexagon, Plus, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

interface Hero {
  id: number;
  name: string;
  title: string;
  description: string;
  imageUrl: string | null;
  cvUrl: string | null;
  availableForWork: boolean;
}

interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
  location: string;
}

interface Skill {
  id: number;
  name: string;
  category: "hard" | "soft" | "tool";
  proficiency: number | null;
  iconUrl: string | null;
}

interface Experience {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
  location: string;
  current: boolean;
}

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string;
  imageUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
}

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string | null;
  description: string | null;
}

interface Contact {
  id: number;
  email: string;
  phone: string | null;
  location: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  facebook: string | null;
  instagram: string | null;
  youtube: string | null;
  discord: string | null;
  website: string | null;
}

export default function Home() {
  const [hero, setHero] = useState<Hero | null>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, eduRes, skillsRes, expRes, projRes, certRes, contactRes] = await Promise.all([
          fetch("/api/hero"),
          fetch("/api/education"),
          fetch("/api/skills"),
          fetch("/api/experience"),
          fetch("/api/projects"),
          fetch("/api/certificates"),
          fetch("/api/contact"),
        ]);

        const [heroData, eduData, skillsData, expData, projData, certData, contactData] = await Promise.all([
          heroRes.json(),
          eduRes.json(),
          skillsRes.json(),
          expRes.json(),
          projRes.json(),
          certRes.json(),
          contactRes.json(),
        ]);

        setHero(Array.isArray(heroData) ? (heroData[0] || null) : null);
        setEducation(Array.isArray(eduData) ? eduData : []);
        setSkills(Array.isArray(skillsData) ? skillsData : []);
        setExperience(Array.isArray(expData) ? expData : []);
        setProjects(Array.isArray(projData) ? projData : []);
        
        // Robust certificate sorting
        const sortedCerts = Array.isArray(certData) 
          ? [...certData].sort((a: Certificate, b: Certificate) => {
              const dateA = new Date(a.issueDate).getTime();
              const dateB = new Date(b.issueDate).getTime();
              return dateB - dateA;
            })
          : [];
        setCertificates(sortedCerts);
        setContact(Array.isArray(contactData) ? (contactData[0] || null) : null);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Ensure lists remain arrays on error
        setEducation([]);
        setSkills([]);
        setExperience([]);
        setProjects([]);
        setCertificates([]);
      } finally {

        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const hardSkills = Array.isArray(skills) ? skills.filter((s) => s.category === "hard") : [];
  const softSkills = Array.isArray(skills) ? skills.filter((s) => s.category === "soft") : [];
  const toolSkills = Array.isArray(skills) ? skills.filter((s) => s.category === "tool") : [];


  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Floating Pill Navbar */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl"
      >
        <div className="flex h-12 md:h-14 items-center justify-between px-4 rounded-full bg-background/70 backdrop-blur-xl border border-border/50 shadow-2xl">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-between flex-1 px-4">
            {["About","Education","Skills","Experience","Projects","Certificates","Contact"].map((item) => (
              <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="px-2 py-2 text-[15px] font-semibold text-muted-foreground hover:text-primary transition-all rounded-xl hover:bg-primary/10 whitespace-nowrap">
                {item}
              </button>
            ))}
          </nav>

          {/* Mobile: hamburger left */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-primary/10 rounded-xl transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl hover:bg-primary/10 transition-all text-muted-foreground hover:text-primary"
            aria-label="Toggle theme"
          >
            {mounted && (theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-2 rounded-3xl bg-background/95 backdrop-blur-2xl border border-border/50 shadow-2xl p-4 overflow-hidden"
          >
            <nav className="flex flex-col space-y-1">
              {["About","Education","Skills","Experience","Projects","Certificates","Contact"].map((item) => (
                <button 
                  key={item} 
                  onClick={() => {
                    scrollToSection(item.toLowerCase());
                    setMobileMenuOpen(false);
                  }} 
                  className="px-4 py-3 text-sm font-medium text-left text-muted-foreground hover:text-primary transition-all rounded-xl hover:bg-primary/10"
                >
                  {item}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </motion.header>

      {/* Modern Hero Section with Profile Image */}
      <section id="about" className="relative pt-28 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-background">
        
        {/* Soft lens glow and bloom around center area */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#6366f1]/10 via-[#6366f1]/5 to-transparent rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-cyan-500/2 to-transparent rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[20%] w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/5 via-pink-500/2 to-transparent rounded-full blur-[80px] pointer-events-none" />

        {/* Faint grid overlays and technical panel lines */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgNDBoNDBNNDAgMHY0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz4KPC9zdmc+')] pointer-events-none opacity-50" />
        
        {/* Vertical thin divider lines across sections */}
        <div className="absolute inset-y-0 left-[15%] w-[1px] bg-gradient-to-b from-transparent via-white/[0.03] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-[15%] w-[1px] bg-gradient-to-b from-transparent via-white/[0.03] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-[20%] h-[1px] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent pointer-events-none" />

        {/* Light noise texture for premium futuristic feel */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        {/* Floating Shapes & Tech Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Wireframe hexagon shapes with subtle blue stroke */}
          <motion.div animate={{ y: [0, 20, 0], rotate: [0, 45, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[15%] left-[8%] text-[#6366f1]/20">
            <Hexagon className="w-16 h-16 stroke-[0.5]" />
          </motion.div>
          <motion.div animate={{ y: [0, -30, 0], rotate: [0, -45, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[20%] right-[10%] text-cyan-500/20">
            <Hexagon className="w-24 h-24 stroke-[0.5]" />
          </motion.div>

          {/* Thin outlined rounded squares in low opacity */}
          <motion.div animate={{ y: [0, 15, 0], x: [0, 15, 0], rotate: [0, 90, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[30%] right-[15%]">
            <div className="w-12 h-12 border border-white/5 rounded-xl rotate-12" />
          </motion.div>
          
          <motion.div animate={{ y: [0, -15, 0], x: [0, -15, 0], rotate: [0, -90, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[35%] left-[12%]">
            <div className="w-20 h-20 border border-white/5 rounded-2xl -rotate-12" />
          </motion.div>

          {/* Dashed circular rings / radar circles */}
          <div className="absolute top-[10%] right-[25%] pointer-events-none opacity-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="w-64 h-64 rounded-full border-[0.5px] border-dashed border-[#6366f1]/40" />
          </div>
          <div className="absolute bottom-[5%] left-[20%] pointer-events-none opacity-20">
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="w-96 h-96 rounded-full border-[0.5px] border-dashed border-cyan-500/30" />
          </div>

          {/* Small bar chart icon in bottom right corner */}
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[10%] right-[5%] text-purple-500/30">
             <BarChart3 className="w-6 h-6 stroke-1" />
          </motion.div>

          {/* Tiny neon dots in cyan, purple, pink */}
          <div className="absolute top-[40%] right-[20%] w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
          <div className="absolute bottom-[25%] left-[30%] w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_8px_#f472b6] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-[20%] left-[45%] w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc] animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[70%] right-[40%] w-2 h-2 rounded-full bg-[#6366f1] shadow-[0_0_8px_#6366f1] animate-pulse" style={{ animationDelay: '3s' }} />

          {/* Floating code snippets in corners */}
          <div className="absolute top-[12%] left-[3%] text-[10px] font-mono text-[#6366f1]/30 opacity-60">
            <motion.div animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
              import numpy as np<br/>import pandas as pd
            </motion.div>
          </div>
          <div className="absolute bottom-[15%] right-[3%] text-[10px] font-mono text-cyan-500/30 opacity-60">
            <motion.div animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
              SELECT * FROM insights<br/>WHERE performance &gt; 90;
            </motion.div>
          </div>
          <div className="absolute top-[25%] right-[5%] text-[10px] font-mono text-pink-500/30 opacity-60">
            <motion.div animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}>
              git commit -m "feat: optimization"
            </motion.div>
          </div>
          <div className="absolute bottom-[25%] left-[5%] text-[10px] font-mono text-emerald-500/30 opacity-60">
            <motion.div animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}>
              async def process_data(x, y):<br/>&nbsp;&nbsp;await model.fit(x, y)
            </motion.div>
          </div>
        </div>
        
        <div className="container relative px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
            {/* Profile Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="flex-shrink-0"
            >
              <div className="relative group">
                {/* Glowing border like reference */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition duration-500" />
                <div className="absolute inset-0 rounded-full border-2 border-white/20" />
                {loading ? (
                  <Skeleton className="relative w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full bg-background" />
                ) : (
                  <img
                    src={hero?.imageUrl || "https://placehold.co/400x400/png?text=Profile"}
                    alt={hero?.name || "Profile"}
                    className="relative w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full object-cover border-4 border-background z-10 shadow-xl"
                  />
                )}
                {/* "Open to work" badge */}
                {!loading && hero?.availableForWork !== false && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute bottom-4 -right-4 md:bottom-6 md:-right-2 z-20 flex items-center gap-1.5 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg border-2 border-background"
                  >
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    Open to work
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Hero Content */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex-1 text-center lg:text-left space-y-6 max-w-2xl"
            >
              <div className="space-y-4 max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32 mb-4" />
                    <Skeleton className="h-10 md:h-14 w-full" />
                    <Skeleton className="h-10 md:h-14 w-3/4" />
                  </div>
                ) : (
                  <>
                    <motion.div variants={fadeInUp} className="inline-block">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs md:text-sm text-gray-300 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        Welcome to my portfolio
                      </div>
                    </motion.div>
                    
                    <motion.h1 
                      variants={fadeInUp}
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-tight"
                    >
                      {hero?.name?.split(' ').map((word, i, arr) => (
                        <span key={i} className={i === arr.length - 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 block mt-1" : "block"}>
                          {word}
                        </span>
                      )) || "Your Name"}
                    </motion.h1>
                    
                    <motion.p 
                      variants={fadeInUp}
                      className="text-lg sm:text-xl font-medium text-cyan-400"
                    >
                      {hero?.title || "Your Title"}
                    </motion.p>
                  </>
                )}
              </div>
              
              {loading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <motion.p 
                  variants={fadeInUp}
                  className="text-sm sm:text-base md:text-lg text-muted-foreground/90 dark:text-gray-300 leading-relaxed"
                >
                  {hero?.description || "Your description here"}
                </motion.p>
              )}

              <motion.div 
                variants={fadeInUp}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-6"
              >
                {hero?.cvUrl && (
                  <a href={hero.cvUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all bg-[#6366f1] text-white hover:bg-[#4f46e5] border border-[#6366f1]/50 rounded-full px-8 h-12 uppercase tracking-[0.2em] text-xs font-bold">
                      Hire Me
                    </Button>
                  </a>
                )}
                {contact?.github && (
                  <a href={contact.github} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="lg" className="gap-2 transition-all bg-muted/50 hover:bg-muted text-foreground border-border rounded-full px-6 h-12 text-xs uppercase tracking-[0.1em]">
                      <Github className="h-4 w-4" />
                      <span>Github</span>
                    </Button>
                  </a>
                )}
                {contact?.linkedin && (
                  <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="lg" className="gap-2 transition-all bg-muted/50 hover:bg-muted text-foreground border-border rounded-full px-6 h-12 text-xs uppercase tracking-[0.1em]">
                      <Linkedin className="h-4 w-4" />
                      <span>LinkedIn</span>
                    </Button>
                  </a>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Infinite Scrolling Skills Marquee (Two Rows, Opposite Directions) */}
      {!loading && (hardSkills.length > 0 || softSkills.length > 0) && (
        <div className="relative flex flex-col gap-4 overflow-hidden bg-muted/30 border-y border-border/50 py-10 pb-16 group">
          {/* Row 1: Left to Right */}
          <div className="flex animate-marquee-reverse gap-4 w-max">
            {[...hardSkills, ...softSkills, ...hardSkills, ...softSkills].map((skill, index) => (
              <div key={`row1-${index}`} className="flex items-center gap-2 px-5 py-2 bg-muted/50 rounded-full border border-border whitespace-nowrap hover:bg-muted transition-colors cursor-default">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="font-medium text-foreground text-sm">{skill.name}</span>
                <span className="text-xs text-muted-foreground font-mono ml-1">{skill.proficiency}%</span>
              </div>
            ))}
          </div>
          {/* Row 2: Right to Left */}
          <div className="flex animate-marquee gap-4 w-max">
            {[...softSkills, ...hardSkills, ...softSkills, ...hardSkills].map((skill, index) => (
              <div key={`row2-${index}`} className="flex items-center gap-2 px-5 py-2 bg-muted/50 rounded-full border border-border whitespace-nowrap hover:bg-muted transition-colors cursor-default">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="font-medium text-foreground text-sm">{skill.name}</span>
                <span className="text-xs text-muted-foreground font-mono ml-1">{skill.proficiency}%</span>
              </div>
            ))}
          </div>
          {/* Gradient fading edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
        </div>
      )}


      {/* Education Section */}
      <section id="education" className="py-24 md:py-32 bg-background relative border-t border-border/50">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex flex-col items-center gap-4 mb-16 text-center"
          >
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] text-foreground">Education</h2>
          </motion.div>
          {loading ? (
            <div className="space-y-6 w-full">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="space-y-6 w-full"
            >
              {education.map((edu) => (
                <motion.div key={edu.id} variants={fadeInUp}>
                  <Card className="group border border-border bg-muted/20 backdrop-blur-3xl rounded-3xl p-2 md:p-4 hover:bg-muted/40 hover:border-primary/20 transition-all duration-500 hover:-translate-y-2 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {edu.degree} <span className="text-gray-500 font-normal">in</span> {edu.field}
                      </CardTitle>
                      <CardDescription className="flex flex-col gap-3 mt-4">
                        <span className="font-semibold text-foreground/90 text-lg">{edu.institution}</span>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs md:text-sm text-muted-foreground">
                          <span className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full border border-border">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                            {edu.startDate} - {edu.endDate || "Present"}
                          </span>
                          <span className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full border border-border">
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                            {edu.location}
                          </span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    {edu.description && (
                      <CardContent>
                        <p className="text-sm md:text-base text-gray-400 leading-relaxed mt-2">{edu.description}</p>
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Skills Section - Ultra Minimalist Layout */}
      <section id="skills" className="py-12 md:py-20 bg-background relative border-t border-border/50">
        <div className="container px-4 md:px-6 mx-auto max-w-5xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex flex-col items-center gap-2 mb-12 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">My Skills</h2>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 w-full"
            >
              {/* Technical Skills Column */}
              <motion.div variants={fadeInUp} className="space-y-8">
                <h3 className="text-lg font-bold text-foreground/80 mb-6 border-l-2 border-primary pl-3">Technical Skills</h3>
                <div className="space-y-6">
                  {hardSkills.map((skill) => (
                    <div key={skill.id} className="group space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-medium uppercase tracking-widest text-muted-foreground dark:text-gray-400 group-hover:text-foreground transition-colors">
                        <span>{skill.name}</span>
                        <span className="font-mono">{skill.proficiency}%</span>
                      </div>
                      <div className="relative h-[1px] w-full bg-muted/30">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          transition={{ duration: 1, ease: "circOut" }}
                          className="absolute top-0 left-0 h-full bg-[#6366f1] shadow-[0_0_8px_#6366f1]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Professional Skills Column */}
              <motion.div variants={fadeInUp} className="space-y-8">
                <h3 className="text-lg font-bold text-foreground/80 mb-6 border-l-2 border-purple-500 pl-3">Professional Skills</h3>
                <div className="space-y-6">
                  {softSkills.map((skill) => (
                    <div key={skill.id} className="group space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-medium uppercase tracking-widest text-muted-foreground dark:text-gray-400 group-hover:text-foreground transition-colors">
                        <span>{skill.name}</span>
                        <span className="font-mono">{skill.proficiency}%</span>
                      </div>
                      <div className="relative h-[1px] w-full bg-muted/30">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          transition={{ duration: 1, ease: "circOut" }}
                          className="absolute top-0 left-0 h-full bg-purple-500 shadow-[0_0_8px_#a855f7]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Tools & Technologies Section - Adjustable Fluid Grid */}
      <section className="py-12 md:py-20 bg-background relative border-t border-border/50">
        <div className="container px-4 md:px-6 mx-auto max-w-5xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex flex-col items-center gap-2 mb-10 text-center"
          >
            <h2 className="text-xl md:text-2xl font-semibold text-gray-400">Tools and Technology</h2>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 w-full">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 w-full"
            >
              {toolSkills.map((tool) => (
                <motion.div 
                  key={tool.id} 
                  variants={fadeInUp}
                  className="group flex flex-col items-center justify-center p-3 rounded-lg hover:bg-muted/10 border border-transparent hover:border-border/50 transition-all duration-300"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 mb-1 flex items-center justify-center transition-all duration-500">
                    {tool.iconUrl ? (
                      <img 
                        src={tool.iconUrl} 
                        alt={tool.name} 
                        className="max-w-full max-h-full object-contain" 
                      />
                    ) : (
                      <Code className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <span className="text-[9px] md:text-[10px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity text-center truncate w-full">
                    {tool.name}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Experience Section - Modern Cards */}
      <section id="experience" className="py-24 md:py-32 bg-background relative border-t border-border/50">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex flex-col items-center gap-4 mb-16 text-center"
          >
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] text-foreground">Experience</h2>
          </motion.div>
          {loading ? (
            <div className="space-y-6 w-full">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="space-y-6 w-full"
            >
              {experience.map((exp, index) => (
                <motion.div key={exp.id} variants={fadeInUp}>
                  <Card className="group border border-white/5 bg-white/[0.02] backdrop-blur-3xl rounded-3xl p-2 md:p-4 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 hover:-translate-y-2 shadow-2xl relative overflow-hidden">
                    {/* Subtle Indigo glow on hover */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#6366f1]/0 to-[#6366f1]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <CardHeader>
                      <CardTitle className="flex items-start justify-between flex-wrap gap-2 text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        <span>{exp.position}</span>
                        {exp.current && (
                          <div className="flex items-center gap-2 bg-[#6366f1]/10 text-[#6366f1] px-3 py-1 rounded-full text-xs font-semibold border border-[#6366f1]/20">
                            <div className="w-1.5 h-1.5 bg-[#6366f1] rounded-full animate-pulse" />
                            Current
                          </div>
                        )}
                      </CardTitle>
                      <CardDescription className="flex flex-col gap-3 mt-4">
                        <span className="font-semibold text-foreground/80 text-lg">{exp.company}</span>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs md:text-sm text-gray-500">
                          <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                            <Calendar className="h-3.5 w-3.5 text-[#6366f1]" />
                            {exp.startDate} - {exp.endDate || "Present"}
                          </span>
                          <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                            <MapPin className="h-3.5 w-3.5 text-[#6366f1]" />
                            {exp.location}
                          </span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    {exp.description && (
                      <CardContent>
                        <p className="text-sm md:text-base text-muted-foreground/90 dark:text-gray-400 leading-relaxed mt-2">{exp.description}</p>
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Projects Section - Enhanced Grid */}
      {/* Projects Section - Enhanced Grid */}
      <section id="projects" className="py-24 md:py-32 bg-background relative border-t border-border/50">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex flex-col items-center gap-4 mb-16 text-center"
          >
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] text-foreground">Projects</h2>
          </motion.div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.slice(0, showAllProjects ? projects.length : 6).map((project) => (
                <motion.div 
                  key={project.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  layout
                >
                  <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-muted/20 backdrop-blur-3xl border border-border hover:border-primary/20 h-full flex flex-col rounded-3xl">
                    {project.imageUrl ? (
                      <div className="h-48 md:h-56 overflow-hidden relative">
                        <img 
                          src={project.imageUrl} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        {project.featured && (
                          <div className="absolute top-4 right-4 gap-1 shadow-lg bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                            <Star className="h-3 w-3 fill-current" />
                            Featured
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-48 md:h-56 bg-muted/50 flex items-center justify-center">
                        <Code className="h-16 w-16 text-muted-foreground/40" />
                      </div>
                    )}
                    <CardHeader className="flex-grow p-6">
                      <CardTitle className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="text-sm md:text-base text-muted-foreground/90 dark:text-gray-400 mt-2">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 space-y-6">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.split(",").map((tech, i) => (
                          <span key={i} className="text-xs font-mono bg-muted/50 text-muted-foreground px-3 py-1.5 rounded-full border border-border">{tech.trim()}</span>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                            <Button variant="outline" size="sm" className="gap-2 w-full bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground rounded-full">
                              <Github className="h-4 w-4" />
                              Code
                            </Button>
                          </a>
                        )}
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                            <Button size="sm" className="gap-2 w-full bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border border-primary/20 rounded-full">
                              <ExternalLink className="h-4 w-4" />
                              Demo
                            </Button>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
          {/* View More Button */}
          {!loading && projects.length > 6 && !showAllProjects && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex justify-center mt-12"
            >
              <Button
                size="lg"
                variant="outline"
                onClick={() => setShowAllProjects(true)}
                className="gap-2 px-8 shadow-md transition-all bg-transparent border-border/50 text-muted-foreground hover:bg-muted/10 hover:text-foreground rounded-full font-mono uppercase tracking-widest text-xs"
              >
                Show More
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Certificates Section */}
      <section id="certificates" className="py-24 md:py-32 bg-background relative border-t border-border/50">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex flex-col items-center gap-4 mb-16 text-center"
          >
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] text-foreground">Certificates</h2>
          </motion.div>
          {loading ? (
            <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 w-full bg-muted/20 animate-pulse rounded-2xl border border-border/50" />
              ))}
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="flex flex-col gap-3 max-w-4xl mx-auto w-full"
            >
              {certificates.map((cert) => (
                <motion.div key={cert.id} variants={fadeInUp}>
                  <div className="group relative flex items-center justify-between p-4 md:p-6 rounded-2xl bg-muted/10 hover:bg-muted/20 border border-border/50 hover:border-primary/20 transition-all duration-300">
                    <div className="flex-1 pr-4">
                      <h3 className="text-sm md:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {cert.title}
                      </h3>
                      <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                        {cert.issuer}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 md:gap-8 shrink-0">
                      <span className="text-[10px] md:text-xs font-mono text-muted-foreground/60 whitespace-nowrap">
                        Issued: {cert.issueDate}
                      </span>
                      
                      {cert.credentialUrl && (
                        <a 
                          href={cert.credentialUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 md:p-3 rounded-full bg-muted/20 hover:bg-primary/10 text-muted-foreground hover:text-primary border border-border/50 hover:border-primary/20 transition-all duration-300"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Contact Section - Modern Design */}
      <section id="contact" className="py-24 md:py-32 bg-background relative border-t border-border/50">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex flex-col items-center gap-4 mb-16 text-center"
          >
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] text-foreground">Get In Touch</h2>
          </motion.div>
          {loading ? (
            <Card className="w-full max-w-2xl mx-auto">
              <CardContent className="pt-6 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ) : contact ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={scaleIn}
              className="w-full max-w-2xl mx-auto"
            >
              <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-muted/20 backdrop-blur-3xl border border-border hover:border-primary/20 rounded-3xl p-4 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366f1]/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#6366f1]/10 transition-colors duration-500" />
                <CardContent className="space-y-6 relative z-10 pt-6 md:pt-2">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/50 border border-border hover:bg-muted hover:border-primary/20 transition-all duration-300">
                    <div className="p-3 bg-[#6366f1]/10 rounded-xl border border-[#6366f1]/20">
                      <Mail className="h-5 w-5 md:h-6 md:w-6 text-[#6366f1]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-mono text-gray-500 mb-1 tracking-widest uppercase">Email</p>
                      <a href={`mailto:${contact.email}`} className="text-base md:text-lg font-semibold text-foreground hover:text-primary transition-colors break-all">
                        {contact.email}
                      </a>
                    </div>
                  </div>
                  {contact.phone && (
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/50 border border-border hover:bg-muted hover:border-primary/20 transition-all duration-300">
                      <div className="p-3 bg-[#6366f1]/10 rounded-xl border border-[#6366f1]/20">
                        <Phone className="h-5 w-5 md:h-6 md:w-6 text-[#6366f1]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs md:text-sm font-mono text-gray-500 mb-1 tracking-widest uppercase">Phone</p>
                        <a href={`tel:${contact.phone}`} className="text-base md:text-lg font-semibold text-foreground hover:text-primary transition-colors">
                          {contact.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {contact.location && (
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/50 border border-border hover:bg-muted hover:border-primary/20 transition-all duration-300">
                      <div className="p-3 bg-[#6366f1]/10 rounded-xl border border-[#6366f1]/20">
                        <MapPin className="h-5 w-5 md:h-6 md:w-6 text-[#6366f1]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs md:text-sm font-mono text-gray-500 mb-1 tracking-widest uppercase">Location</p>
                        <p className="text-base md:text-lg font-semibold text-foreground">{contact.location}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-4 pt-6">
                    {contact.github && (
                      <a href={contact.github} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[140px]">
                        <Button variant="outline" size="lg" className="gap-2 w-full bg-transparent border-white/10 text-gray-300 hover:bg-[#6366f1] hover:text-white hover:border-[#6366f1] rounded-full transition-all duration-300">
                          <Github className="h-5 w-5" />
                          GitHub
                        </Button>
                      </a>
                    )}
                    {contact.linkedin && (
                      <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[140px]">
                        <Button variant="outline" size="lg" className="gap-2 w-full bg-transparent border-white/10 text-gray-300 hover:bg-[#6366f1] hover:text-white hover:border-[#6366f1] rounded-full transition-all duration-300">
                          <Linkedin className="h-5 w-5" />
                          LinkedIn
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : null}
        </div>
      </section>

      {/* Footer with Social Links */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="border-t border-border/50 py-12 md:py-16 bg-background"
      >
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-8">
            {/* Social Media Links */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {contact?.github && (
                <a href={contact.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-muted/50 border border-border rounded-2xl hover:bg-primary/10 text-muted-foreground hover:text-primary hover:border-primary/20 transition-all duration-300" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </a>
              )}
              {contact?.linkedin && (
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-muted/50 border border-border rounded-2xl hover:bg-primary/10 text-muted-foreground hover:text-primary hover:border-primary/20 transition-all duration-300" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {contact?.twitter && (
                <a href={contact.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-muted/50 border border-border rounded-2xl hover:bg-primary/10 text-muted-foreground hover:text-primary hover:border-primary/20 transition-all duration-300" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {contact?.facebook && (
                <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className="p-3 bg-muted/50 border border-border rounded-2xl hover:bg-primary/10 text-muted-foreground hover:text-primary hover:border-primary/20 transition-all duration-300" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {contact?.instagram && (
                <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-muted/50 border border-border rounded-2xl hover:bg-primary/10 text-muted-foreground hover:text-primary hover:border-primary/20 transition-all duration-300" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {contact?.youtube && (
                <a href={contact.youtube} target="_blank" rel="noopener noreferrer" className="p-3 bg-muted/50 border border-border rounded-2xl hover:bg-primary/10 text-muted-foreground hover:text-primary hover:border-primary/20 transition-all duration-300" aria-label="YouTube">
                  <Youtube className="h-5 w-5" />
                </a>
              )}
              {contact?.discord && (
                <a href={contact.discord} target="_blank" rel="noopener noreferrer" className="p-3 bg-muted/50 border border-border rounded-2xl hover:bg-primary/10 text-muted-foreground hover:text-primary hover:border-primary/20 transition-all duration-300" aria-label="Discord">
                  <MessageCircle className="h-5 w-5" />
                </a>
              )}
              {contact?.website && (
                <a href={contact.website} target="_blank" rel="noopener noreferrer" className="p-3 bg-muted/50 border border-border rounded-2xl hover:bg-primary/10 text-muted-foreground hover:text-primary hover:border-primary/20 transition-all duration-300" aria-label="Website">
                  <Globe className="h-5 w-5" />
                </a>
              )}
              {contact?.email && (
                <a href={`mailto:${contact.email}`} className="p-3 bg-muted/50 border border-border rounded-2xl hover:bg-primary/10 text-muted-foreground hover:text-primary hover:border-primary/20 transition-all duration-300" aria-label="Email">
                  <Mail className="h-5 w-5" />
                </a>
              )}
            </div>
            <p className="text-sm font-mono text-gray-500 text-center tracking-widest uppercase">
              © {new Date().getFullYear()} {hero?.name || ""}. All rights reserved.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}