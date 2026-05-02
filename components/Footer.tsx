interface FooterProps {
  hideStrips?: boolean;
}

export default function Footer({ hideStrips = false }: FooterProps) {
  return (
    <div className="relative w-full mt-32">
      {/* Decorative Strips for Footer Only */}
      {!hideStrips && (
        <div className="absolute bottom-0 left-0 right-0 h-[1000px] pointer-events-none select-none z-20">
          <img
            src="/vectors/main_left_circles.png"
            alt=""
            className="absolute left-0 bottom-0 w-[200px] md:w-[250px] lg:w-[300px] h-auto opacity-90 object-cover object-bottom"
          />
          <img
            src="/vectors/main_right_circles.png"
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

        <div className="relative z-40 max-w-[1650px] mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row justify-between items-center gap-12">
          {/* Left side */}
          <div className="relative z-10 w-full md:w-[45%]">
            <h2 className="text-white text-[28px] md:text-[36px] lg:text-[48px] font-bold leading-[1.05] tracking-tight">
              Hi, I&apos;m{" "}
              <span className="font-accent text-[1.4em] text-[#3FE2FF] leading-none inline-block transform translate-y-3">
                Naya
              </span>
              ! I&apos;m a digital &amp; traditional artist,
              <br />
              illustrator, graphic designer and animator
              <br />
              based in Damascus-Syria.
            </h2>

            <div className="mt-12 space-y-8 max-w-[580px]">
              <p className="text-white/80 text-[15px] md:text-[17px] leading-relaxed font-normal">
                I have a degree in Graphic Design. I create work with love and purpose.
                I have a huge passion for creating new ideas and turning them into unique
                artworks. What I love most is drawing, especially when it comes to anime,
                comics, and character design. Most of my drawings are personal projects
                and challenges to develop my skills.
              </p>
              <p className="text-white/80 text-[15px] md:text-[17px] leading-relaxed font-normal">
                I have previously worked as a storyboard artist at Spacetoon. Before that
                I graduated from The Faculty of Fine Arts of Damascus University.
              </p>
            </div>

            <div className="mt-14 space-y-5">
              <a
                href="mailto:khourynaya5@gmail.com"
                className="flex items-center gap-5 text-[#3FE2FF] text-[20px] md:text-[24px] font-bold no-underline hover:brightness-110 transition-all group"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[#3FE2FF]/10 rounded-full group-hover:scale-110 transition-transform">
                  <img src="/vectors/message_svg.svg" alt="Email" className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                khourynaya5@gmail.com
              </a>
              <a
                href="https://instagram.com/nayakhouryart"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-5 text-[#3FE2FF] text-[20px] md:text-[24px] font-bold no-underline hover:brightness-110 transition-all group"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[#3FE2FF]/10 rounded-full group-hover:scale-110 transition-transform">
                  <img src="/vectors/instagram_svg.svg" alt="Instagram" className="w-6 h-6 md:w-7 md:h-7" />
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
          <div className="relative w-full md:w-[55%] flex justify-center md:justify-end z-50">
            <img
              src="/vectors/bottompagecirclesandnaya.png"
              alt="Naya with decorative circles"
              className="w-full max-w-[1000px] h-auto pointer-events-none select-none drop-shadow-2xl scale-110 md:scale-125 origin-right"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
