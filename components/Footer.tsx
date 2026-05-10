interface FooterProps {
  hideStrips?: boolean;
}

export default function Footer({ hideStrips = false }: FooterProps) {
  return (
    <div className="relative w-full mt-4 md:mt-8">
      {/* Decorative Strips for Footer Only */}
      {!hideStrips && (
        <div className="absolute bottom-0 left-0 right-0 h-[1000px] pointer-events-none select-none z-20">
          <img
            src="/vectors/main_left_circles.webp"
            alt=""
            className="absolute left-0 bottom-0 w-[200px] md:w-[250px] lg:w-[300px] h-auto opacity-90 object-cover object-bottom"
          />
          <img
            src="/vectors/main_right_circles.webp"
            alt=""
            className="absolute right-0 bottom-0 w-[200px] md:w-[250px] lg:w-[300px] h-auto opacity-90 object-cover object-bottom"
          />
        </div>
      )}

      {/* 
          CRITICAL: DO NOT add overflow-hidden to this section. 
          This allows the character artwork and circles to overflow 
          upwards into the main content as requested by the user. 
      */}
      <section id="about-me" className="relative z-10 w-full bg-[#0F314D] pb-32">
        {/* Dark Divider Bar */}
        <div className="w-full h-12 md:h-16 bg-[#0B1D32] mb-16 md:mb-24" />

        <div className="relative z-40 max-w-[1920px] mx-auto px-6 md:px-12 lg:px-12 flex flex-col-reverse md:flex-row justify-between items-center gap-12">
          {/* Left side */}
          <div className="relative z-10 w-full md:w-[45%] lg:w-[65%]">
            <h2 className="text-white text-[34px] md:text-[42px] lg:text-[64px] font-bold leading-[1.05] tracking-tight">
              Hi, I&apos;m{" "}
              <span className="font-accent text-[1.0em] lg:text-[1.1em] text-[#3FE2FF] leading-none inline-block">
                Naya
              </span>
              ! I&apos;m a digital &amp; traditional <br className="md:hidden" /> artist,
              <br className="hidden md:block" />
              illustrator, graphic designer & <br className="md:hidden" /> animator
              <br />
              based in Damascus-Syria.
            </h2>

            <div className="mt-12 space-y-8 max-w-[580px] lg:max-w-[800px]">
              <p className="text-white/80 text-[18px] md:text-[20px] lg:text-[22px] leading-relaxed font-normal">
                I have a degree in Graphic Design. I create work with love and purpose.
                I have a huge passion for creating new ideas and turning them into unique
                artworks. What I love most is drawing, especially when it comes to anime,
                comics, and character design. Most of my drawings are personal projects
                and challenges to develop my skills.
              </p>
              <p className="text-white/80 text-[18px] md:text-[20px] lg:text-[22px] leading-relaxed font-normal">
                I have previously worked as a storyboard artist at Spacetoon. Before that
                I graduated from The Faculty of Fine Arts of Damascus University.
              </p>
            </div>

            <div className="mt-14 space-y-5 lg:space-y-8">
              <a
                href="mailto:khourynaya5@gmail.com"
                className="flex items-center gap-5 lg:gap-8 text-[#3FE2FF] text-[24px] md:text-[28px] lg:text-[32px] font-bold no-underline hover:brightness-110 transition-all group"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center bg-[#3FE2FF]/10 rounded-full group-hover:scale-110 transition-transform">
                  <img src="/vectors/message_svg.svg" alt="Email" className="w-6 h-6 md:w-7 md:h-7 lg:w-10 lg:h-10" />
                </div>
                khourynaya5@gmail.com
              </a>
              <a
                href="https://instagram.com/nayakhouryart"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-5 lg:gap-8 text-[#3FE2FF] text-[24px] md:text-[28px] lg:text-[32px] font-bold no-underline hover:brightness-110 transition-all group"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center bg-[#3FE2FF]/10 rounded-full group-hover:scale-110 transition-transform">
                  <img src="/vectors/instagram_svg.svg" alt="Instagram" className="w-6 h-6 md:w-7 md:h-7 lg:w-10 lg:h-10" />
                </div>
                @nayakhouryart
              </a>
            </div>
          </div>

          {/* 
              CRITICAL: (ill kill you if you touch this) 
              This container handles the perfect scale and positioning 
              for the footer artwork. DO NOT TOUCH.
          */}
          {/* Right side — relative with high z-index to overlap divider */}
          <div className="relative w-full md:w-[55%] lg:w-[45%] flex justify-center md:justify-end z-50">
            <img
              src="/vectors/bottompagecirclesandnaya.webp"
              alt="Naya with decorative circles"
              className="w-full max-w-[1000px] h-auto pointer-events-none select-none drop-shadow-2xl scale-110 md:scale-125 origin-right"
            />
          </div>
        </div>
        {/* Developer Credit */}
        <div className="absolute bottom-10 left-0 right-0 text-center z-50">
          <a
            href="https://github.com/yahyazawadi/naya_portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 text-[#3FE2FF] text-[15px] md:text-[16px] lg:text-[18px] font-bold tracking-wide no-underline hover:brightness-125 transition-all opacity-90"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            developed and maintained by yahya amoudi
          </a>
        </div>
      </section>
    </div>
  );
}
