import Link from "next/link";
import { Brain, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getHomeStats } from "@/lib/home-stats";

export const revalidate = 300;

const HERO_BUTTON_BASE_SX = {
  px: 4,
  py: 2,
  backgroundColor: "#ffffffcc",
  backdropFilter: "blur(6px)",
  color: "#374151",
  fontWeight: 700,
  borderRadius: "1rem",
  borderWidth: "2px",
  borderStyle: "solid",
  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.12)",
  transform: "scale(1)",
  transition: "all .3s ease",
};

const heroCards = [
  {
    id: "articles",
    href: "/articles",
    title: "Articles de santé",
    description: "Des contenus validés par des professionnels",
    icon: Brain,
    cardClass:
      "absolute top-0 right-0 w-full h-56 bg-linear-to-br from-yellow-400/90 to-amber-500/90 backdrop-blur-xl rounded-2xl shadow-2xl transform rotate-6 hover:rotate-0 hover:scale-110 transition-all duration-500 cursor-pointer z-10 hover:z-40",
  },
  {
    id: "activites",
    href: "/activites",
    title: "Activités de détente",
    description: "Méditation, respiration et relaxation",
    icon: Zap,
    cardClass:
      "absolute top-16 right-12 w-full h-56 bg-linear-to-br from-emerald-500/95 to-green-600/95 backdrop-blur-xl rounded-2xl shadow-2xl transform -rotate-6 hover:rotate-0 hover:scale-110 transition-all duration-500 cursor-pointer z-20 hover:z-40",
  },
];

export default async function Page() {
  const homeStats = await getHomeStats();

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-emerald-50/30 to-yellow-50/30 md:from-white md:via-emerald-300/30 md:to-yellow-400/30 pb-24 md:pb-6">
      {/* Hero Section - Full Height */}
      <section className="relative flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-15 pb-15 md:pt-20 md:pb-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating orbs */}
          <div className="absolute top-20 left-[10%] w-72 h-72 bg-linear-to-br from-emerald-400/20 to-green-300/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-linear-to-br from-yellow-400/20 to-amber-300/10 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-linear-to-br from-emerald-300/10 via-green-200/5 to-yellow-300/10 rounded-full blur-3xl"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-6 animate-fade-in">
              {/* Hero Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Cultivez votre
                <br />
                <span className="relative inline-block mt-2">
                  <span className="bg-linear-to-r from-emerald-500 via-green-500 to-emerald-600 bg-clip-text text-transparent">
                    sérénité
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-3 bg-linear-to-r from-emerald-400/30 via-green-400/30 to-emerald-400/30 blur-sm"></div>
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Une plateforme innovante dédiée à votre santé mentale et au bien-être quotidien,
                conçue avec expertise et bienveillance.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/articles" className="no-underline">
                  <Button
                    className="w-full sm:w-auto"
                    variant="outlined"
                    sx={{
                      ...HERO_BUTTON_BASE_SX,
                      borderColor: "#fcd34d",
                      "&:hover": {
                        borderColor: "#f59e0b",
                        backgroundColor: "#fff",
                        boxShadow: "0 14px 24px rgba(0, 0, 0, 0.16)",
                        transform: "scale(1.05)",
                      },
                    }}
                    startIcon={<Brain className="w-5 h-5 text-amber-500" />}
                  >
                    Voir les articles
                  </Button>
                </Link>

                <Link href="/activites" className="no-underline">
                  <Button
                    className="w-full sm:w-auto"
                    variant="outlined"
                    sx={{
                      ...HERO_BUTTON_BASE_SX,
                      borderColor: "#6ee7b7",
                      "&:hover": {
                        borderColor: "#10b981",
                        backgroundColor: "#fff",
                        boxShadow: "0 14px 24px rgba(0, 0, 0, 0.16)",
                        transform: "scale(1.05)",
                      },
                    }}
                    startIcon={<Zap className="w-5 h-5 text-emerald-500" />}
                  >
                    Voir les activités
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column - Feature Cards */}
            <div className="relative hidden lg:block">
              {/* 3D Card Stack */}
              <div className="relative h-[350px]">
                {heroCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <Link href={card.href} key={card.id} className={`${card.cardClass} group`}>
                      <div className="p-8 h-full flex flex-col justify-between">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-3xl transition-all duration-300">
                            {card.title}
                          </h3>
                          <p className="text-white/90 font-medium">{card.description}</p>
                          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="inline-flex items-center gap-2 text-white/90 font-semibold">
                              <span>Explorer</span>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Bottom */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 lg:mt-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {homeStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="relative group bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Hover overlay foncé */}
                <div className={`absolute inset-0 bg-linear-to-br ${stat.gradient} opacity-0 group-hover:opacity-15 rounded-2xl transition-opacity duration-300`}></div>
                <div className="relative">
                  <Icon className={`w-8 h-8 mb-3 bg-linear-to-r ${stat.gradient} bg-clip-text text-transparent`} />
                  <div className={`text-3xl font-black bg-linear-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-semibold">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
