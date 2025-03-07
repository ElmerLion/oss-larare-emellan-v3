import { motion } from "framer-motion";
import { Link as ScrollLink, Element } from "react-scroll";
import { Button } from "@/components/ui/button";

export function HeroSection() {
    return (
      <Element name="hero" id="hero">
        <section className="relative pt-24 h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 z-10">

          {/* Blobs */}
      {/* SVG Background */}
      <svg
        className="absolute inset-0 w-full h-full -z-9 animate-zoom"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 800"
      >
        <g fill="none" fillRule="evenodd">
          {/* Center Blob */}
          <circle
            cx="400"
            cy="400"
            r="245"
            fill="url(#blobGradient)"
            opacity="0.2"
          />

          {/* Right Blob */}
          <circle
            cx="700"
            cy="350"
            r="200"
            fill="url(#blobGradient)"
            opacity="0.2"
          />

          {/* Top-Left Blob */}
          <circle
            cx="100"
            cy="450"
            r="200"
            fill="url(#blobGradient)"
            opacity="0.2"
          />
        </g>
        <defs>
          <radialGradient id="blobGradient" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#c9d9c8" />
            <stop offset="100%" stopColor="#e4ebe4" />
          </radialGradient>
        </defs>
      </svg>
                <div className="absolute w-full h-full z-10 hidden md:block">
                    <svg
                        className="absolute inset-0 w-full h-full"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 800 800"
                    >
                        {/* Right Edge Blobs */}
                        <g transform="translate(400, 100)">
                            <g className="floating delay-0">
                                <path
                                    d="M700 500 C770 430, 870 430, 870 550 C870 670, 770 720, 700 670 C630 620, 630 550, 700 500 Z"
                                    fill="var(--secondary2)"
                                    opacity="1"
                                />
                            </g>
                        </g>

                        <g transform="translate(480, 300)">
                            <g className="floating delay-1">
                                <path
                                    d="M670 180 C700 150, 800 150, 800 250 C800 350, 600 400, 650 350 C500 200, 600 250, 650 200 Z"
                                    fill="var(--secondary)"
                                    opacity="1"
                                />
                            </g>
                        </g>

                        <g transform="translate(420, 120)">
                            <g className="floating delay-2">
                                <path
                                    d="M600 500 C580 480, 550 520, 580 540 C610 560, 630 520, 610 500 C590 480, 600 500, 600 500 Z"
                                    fill="var(--secondary2)"
                                    opacity="1"
                                />
                            </g>
                        </g>

                        {/* Left Edge Blobs */}
                        <g transform="translate(-450, 350)">
                            <g className="floating delay-0">
                                <path
                                    d="M120 80 C100 60, 80 120, 120 140 C160 160, 180 120, 160 100 C140 80, 140 80, 120 80 Z"
                                    fill="var(--secondary2)"
                                    opacity="1"
                                />
                            </g>
                        </g>

                        <g transform="translate(-550, 300)">
                            <g className="floating delay-1">
                                <path
                                    d="M100 150 C50 100, 50 350, 150 400 C250 450, 300 350, 250 250 C200 200, 150 200, 100 150 Z"
                                    fill="var(--secondary2)"
                                    opacity="1"
                                />
                            </g>
                        </g>

                        <g transform="translate(-500, 50)">
                            <g className="floating delay-2">
                                <path
                                    d="M50 600 C0 550, 0 650, 100 700 C200 750, 250 650, 200 600 C150 550, 100 550, 50 600 Z"
                                    fill="var(--secondary2)"
                                    opacity="1"
                                />
                            </g>
                        </g>

                        <g transform="translate(-400, 80)">
                            <g className="floating delay-3">
                                <path
                                    d="M50 600 C20 650, 0 650, 100 700 C200 750, 250 650, 250 600 C250 650, 100 550, 50 600 Z"
                                    fill="var(--secondary)"
                                    opacity="1"
                                />
                            </g>
                        </g>
                    </svg>
                </div>






          {/* Text Content */}
          <div className="relative z-10 text-center max-w-4l mx-auto relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-zoom"
            >
              Framtidens <span className="text-[var(--ole-green)] underline">Community</span> för{' '}
                <span className="text-[var(--ole-green)] underline">Lärare</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xl sm:text-2xl text-gray-900 mb-8"
            >
              Dela{" "}
              <span className="relative text-[var(--ole-green)] font-bold">
                kunskap
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,5 Q25,10 50,5 T100,5 M0,7 Q25,12 50,7 T100,7"
                    stroke="var(--ole-green)"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </span>
              , bygg{" "}
              <span className="relative text-[var(--ole-green)] font-bold">
                nätverk
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,5 C25,10 75,0 100,5"
                    stroke="var(--ole-green)"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </span>
              , och{" "}
              <span className="relative text-[var(--ole-green)] font-bold">
                utvecklas
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,5 Q25,0 50,5 T100,5"
                    stroke="var(--ole-green)"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </span>{" "}
              tillsammans
            </motion.p>
            <ScrollLink to="about" smooth duration={500} className="cursor-pointer">
                        <Button
                variant="primary"
                size="lg"
                className="text-lg px-8 btn-animated"
              >
                Läs mer
              </Button>
            </ScrollLink>
          </div>
        </section>
      </Element>

    )

}