import Link from "next/link";

const portfolioItems = [
  {
    src: "/images/DigitalArt&Illustration.webp",
    title: "Digital Art & Illustration",
    subtitle: "Using Krita, StylusX\n& Clip Studio Paint",
    href: "/digital-art",
    type: "wide",
  },
  {
    src: "/images/traditionalarts&crafts.webp",
    title: "Traditional Art & Crafts",
    subtitle: "Paintings made with Water/Acrylic colors\nClay & other craftrs",
    href: "/traditional-art",
    type: "narrow",
  },
  {
    src: "/images/illustrator&photoshop.webp",
    title: "Graphic Design",
    subtitle: "Illustrator & Photoshop",
    href: "/graphic-design",
    type: "narrow",
  },
  {
    src: "/images/Animation&MotionGraphics.webp",
    title: "Animation & Motion Graphics",
    subtitle: "Krita, Illustrator, Adobe Animate\n& Adobe After Effects",
    href: "/animation",
    type: "wide",
  },
];

export default function Home() {
  return (
    <div className="relative w-full bg-[#0B1D32]">
      {/* ═══════════════════════════════════════════════
          SECTION 1 — City skyline (Main Background)
          ═══════════════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden z-0">
        <div className="relative w-[110%] -left-[5%]">
          <img
            src="/images/city.webp"
            alt="City Background"
            className="w-full h-auto block"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 2 — Clouds + Character + Vectors
          ═══════════════════════════════════════════════ */}
      <div className="relative w-full -mt-[45vw] md:-mt-[40vw] lg:-mt-[35vw] z-10 overflow-hidden">
        {/* Upper cloud layer */}
        <img
          src="/images/cloud_up.png"
          alt=""
          className="relative w-full h-auto block z-10"
        />

        {/* Lower cloud layer */}
        <img
          src="/images/cloud_down.png"
          alt=""
          className="relative w-full h-auto block z-10 -mt-[12vw]"
        />

        {/* Character + Vectors overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none pt-[10vw]">
          <img
            src="/vectors/mainpagebackgroundcirclescopy.png"
            alt=""
            className="absolute w-[140%] min-w-[1500px] h-auto opacity-90"
          />
          <img
            src="/images/nayaherself.png"
            alt="Naya"
            className="relative w-[60%] max-w-[850px] h-auto z-10"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 3 & 4 — Content Area
          ═══════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════
          CONTENT WRAPPER (Sections 3, 4, & 5)
          ═══════════════════════════════════════════════ */}
      <div className="relative w-full">
        {/* --- Shared Background Decorative Elements (Strips) --- */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          <img
            src="/vectors/main_left_circles.png"
            alt=""
            className="absolute left-0 top-0 w-[400px] md:w-[600px] lg:w-[800px] h-auto opacity-30 mix-blend-screen"
          />
          <img
            src="/vectors/main_right_circles.png"
            alt=""
            className="absolute right-0 top-0 w-[400px] md:w-[600px] lg:w-[800px] h-auto opacity-30 mix-blend-screen"
          />
        </div>

        {/* ── Section 3 & 4: Intro & Grid ── */}
        <div className="relative z-10">
          {/* Intro Text */}
          <div className="relative z-40 text-center px-6 -mt-[12vw] pb-32">
            <p className="font-sans text-white text-base md:text-lg lg:text-xl font-normal leading-relaxed tracking-wide max-w-[850px] mx-auto">
              Hi, I&apos;m{" "}
              <span className="font-accent text-[2.6em] md:text-[3em] text-[#3FE2FF] align-middle px-1 leading-none">
                Naya
              </span>
              ! I&apos;m a digital &amp; traditional artist,
              <br />
              illustrator, graphic designer and animator.
            </p>
          </div>

          {/* The Grid */}
          <div className="relative z-30 max-w-[1650px] mx-auto px-4 md:px-10 lg:px-20 pb-40 flex flex-col gap-y-32">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-[1100fr_506fr] gap-x-16 items-start">
              {[portfolioItems[0], portfolioItems[1]].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col no-underline"
                >
                  <div className={`relative overflow-hidden rounded-[8px] shadow-2xl transition-all duration-500 group-hover:scale-[1.015] group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)] ${item.type === 'wide' ? 'aspect-[1100/768]' : 'aspect-[506/768]'}`}>
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-8 text-center">
                    <h3 className="font-sans font-bold text-white text-[18px] md:text-[20px] tracking-tight">{item.title}</h3>
                    <p className="font-sans text-white/50 text-[14px] md:text-[15px] mt-2 whitespace-pre-line font-medium leading-relaxed italic">{item.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-[506fr_1100fr] gap-x-16 items-start">
              {[portfolioItems[2], portfolioItems[3]].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col no-underline"
                >
                  <div className={`relative overflow-hidden rounded-[8px] shadow-2xl transition-all duration-500 group-hover:scale-[1.015] group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)] ${item.type === 'wide' ? 'aspect-[1100/768]' : 'aspect-[506/768]'}`}>
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-8 text-center">
                    <h3 className="font-sans font-bold text-white text-[18px] md:text-[20px] tracking-tight">{item.title}</h3>
                    <p className="font-sans text-white/50 text-[14px] md:text-[15px] mt-2 whitespace-pre-line font-medium leading-relaxed italic">{item.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Section 5: About & Contact ── */}
        <section className="relative z-20 w-full bg-[#0F314D] overflow-hidden pb-32">
          {/* Dark Divider Bar */}
          <div className="w-full h-12 md:h-16 bg-[#0B1D32] mb-16 md:mb-24" />

          <div className="relative max-w-[1650px] mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row justify-between items-center gap-12">
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

            {/* Right side */}
            <div className="relative w-full md:w-[55%] flex justify-center md:justify-end">
              <img
                src="/vectors/bottompagecirclesandnaya.png"
                alt="Naya with decorative circles"
                className="w-full max-w-[1000px] h-auto pointer-events-none select-none drop-shadow-2xl scale-110 md:scale-125 origin-right"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
