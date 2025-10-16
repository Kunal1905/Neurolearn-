"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, BookOpen, Target, Zap, TrendingUp, Award, Sparkles, ChevronRight, Play, CheckCircle, ArrowRight, Menu, X, Rocket, LineChart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      const sections = document.querySelectorAll('[data-animate]');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        
        if (isVisible && !section.classList.contains('animated')) {
          section.classList.add('animated');
          setVisibleSections(prev => new Set(prev).add(section.id));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        [data-animate] {
          opacity: 0;
        }

        [data-animate].animated {
          animation-duration: 0.8s;
          animation-fill-mode: forwards;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        [data-animate="fade-up"].animated {
          animation-name: fadeInUp;
        }

        [data-animate="scale"].animated {
          animation-name: scaleIn;
        }

        [data-animate="slide-left"].animated {
          animation-name: slideInLeft;
        }

        [data-animate="slide-right"].animated {
          animation-name: slideInRight;
        }

        [data-delay="100"].animated { animation-delay: 0.1s; }
        [data-delay="200"].animated { animation-delay: 0.2s; }
        [data-delay="300"].animated { animation-delay: 0.3s; }
        [data-delay="400"].animated { animation-delay: 0.4s; }
        [data-delay="500"].animated { animation-delay: 0.5s; }
        [data-delay="600"].animated { animation-delay: 0.6s; }

        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .btn-glow {
          transition: all 0.3s ease;
        }

        .btn-glow:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }

        .gradient-text {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .floating {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .mesh-gradient {
          background: 
            radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.15) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.15) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(139, 92, 246, 0.15) 0px, transparent 50%);
        }

        .shimmer-effect {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }

        .stat-card {
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.5s;
        }

        .stat-card:hover::before {
          left: 100%;
        }
      `}</style>

      {/* Header */}
<header
  className={`border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 transition-all duration-300 ${
    scrolled ? "bg-background/95 shadow-md" : "bg-background/80"
  }`}
>
  <div className="container mx-auto px-4 py-3 flex items-center justify-between">
    {/* Logo */}
    <div
      className="flex items-center space-x-2"
      data-animate="slide-left"
    >
      <Image
        src="/logo.svg"
        width={200}
        height={60}
        alt="NeuroLearn Logo"
        className="object-contain h-10 w-auto sm:h-12"
        priority
        style={{ backgroundColor: 'transparent' }}
      />
    </div>

    {/* Desktop Nav Button */}
    <div
      className="hidden md:flex items-center space-x-4"
      data-animate="slide-right"
    >
    <Button asChild className="btn-glow">
  <Link href="/sign-in">Get Started</Link>
</Button>

    </div>

    {/* Mobile Menu Button */}
    <button
      className="md:hidden"
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    >
      {mobileMenuOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <Menu className="h-6 w-6" />
      )}
    </button>
  </div>

  {/* Mobile Menu Dropdown */}
  {mobileMenuOpen && (
    <div className="md:hidden border-t bg-background p-4 space-y-3">
      <div className="pt-3 space-y-2">
        <Button className="w-full" asChild>
          <Link href="/sign-in">Get Started</Link>
        </Button>
      </div>
    </div>
  )}
</header>


      {/* Hero Section */}
      <section className="py-20 md:py-32 mesh-gradient overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div data-animate="fade-up" id="hero-badge">
                <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0" variant="secondary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Powered Learning Revolution
                </Badge>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6" data-animate="fade-up" data-delay="100" id="hero-title">
                Unlock Your Brain's{" "}
                <span className="gradient-text">Learning Potential</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed" data-animate="fade-up" data-delay="200" id="hero-desc">
                Experience personalized education that adapts to your unique learning style. 
                NeuroLearn uses cutting-edge neuroscience research to optimize your learning journey.
              </p>
            
            </div>
            
            <div className="relative" data-animate="scale" data-delay="200" id="hero-image">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl floating">
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop&q=80" 
                  alt="Student learning with laptop"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" data-animate="fade-up" id="features-title">
              Why Choose NeuroLearn?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-animate="fade-up" data-delay="100" id="features-desc">
              Our platform combines neuroscience research with modern technology to create 
              the most effective learning experience possible.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'Adaptive Learning',
                description: 'Our AI analyzes your learning patterns and adapts content difficulty and pace to optimize retention and understanding.',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Target,
                title: 'Personalized Paths',
                description: 'Get a learning journey tailored specifically to your goals, learning style, and knowledge gaps.',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: Zap,
                title: 'Accelerated Results',
                description: 'Learn 3x faster with scientifically-proven techniques that enhance memory retention and comprehension.',
                gradient: 'from-orange-500 to-red-500'
              }
            ].map((feature, i) => (
              <div key={i} data-animate="fade-up" data-delay={`${(i + 1) * 100}`} id={`feature-${i}`}>
                <Card className="border-0 shadow-xl hover-lift h-full bg-gradient-to-br from-white to-secondary/30 dark:from-gray-900 dark:to-gray-800">
                  <CardHeader>
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 mesh-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" data-animate="fade-up" id="how-title">
              How NeuroLearn Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-animate="fade-up" data-delay="100" id="how-desc">
              Simple steps to transform your learning experience
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div data-animate="slide-left" data-delay="200" id="how-image-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&q=80" 
                  alt="Team learning together"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  num: '1',
                  title: 'Assessment & Goal Setting',
                  desc: 'Complete a brief assessment to identify your learning style, knowledge level, and personal learning goals.'
                },
                {
                  num: '2',
                  title: 'Personalized Learning Path',
                  desc: 'Our AI creates a customized curriculum with lessons, exercises, and assessments tailored to your needs.'
                },
                {
                  num: '3',
                  title: 'Adaptive Learning Experience',
                  desc: 'Learn through interactive content that adapts in real-time based on your progress and performance.'
                }
              ].map((step, i) => (
                <div key={i} className="flex items-start space-x-4" data-animate="slide-right" data-delay={`${200 + (i * 100)}`} id={`step-${i}`}>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0 shadow-lg">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div data-animate="fade-up" id="cta-icon">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Rocket className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6" data-animate="fade-up" data-delay="100" id="cta-title">
            Ready to Transform Your Learning?
          </h2>
          
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed" data-animate="fade-up" data-delay="200" id="cta-desc">
            Join thousands of learners who are already experiencing the power of 
            neuroscience-based education. Start your free trial today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center" data-animate="fade-up" data-delay="300" id="cta-buttons">
            <Button size="lg" className="text-lg px-10 py-6 bg-white text-blue-600 hover:bg-gray-100 font-semibold shadow-2xl" asChild>
              <Link href="/sign-up">
                Start Free Trial
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

